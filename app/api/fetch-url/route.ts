// app/api/fetch-url/route.ts
//
// 単一URLを安全に取得するAPI。
//  - robots.txt を確認し、Disallow なら取得しない
//  - タイムアウトあり
//  - HTMLのみ対象（PDF等は対象外）
//  - サイズ上限あり
//  - ログイン/課金ページの単純検知でスキップ

import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TIMEOUT_MS = 8000;
const MAX_BYTES = 1_500_000; // 約1.5MB
const UA = "kobu-chan-dashboard/0.4 (personal use)";

interface FetchOutcome {
  url: string;
  ok: boolean;
  status: "ok" | "取得不可";
  reason?: string;
  html?: string;
}

function timeoutFetch(url: string, ms: number, headers: Record<string, string>) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  return fetch(url, { signal: ctrl.signal, headers, redirect: "follow" }).finally(
    () => clearTimeout(t)
  );
}

// robots.txt を取得して、対象パスが Disallow されていないか簡易判定
async function allowedByRobots(target: URL): Promise<boolean> {
  try {
    const robotsUrl = `${target.origin}/robots.txt`;
    const res = await timeoutFetch(robotsUrl, 4000, { "User-Agent": UA });
    if (!res.ok) return true; // robots.txt が無い/読めない → 許可扱い
    const body = await res.text();

    // User-agent: * ブロックの Disallow を対象に判定（簡易実装）
    const lines = body.split(/\r?\n/).map((l) => l.trim());
    let inStar = false;
    const disallows: string[] = [];
    for (const line of lines) {
      if (/^user-agent:/i.test(line)) {
        inStar = /:\s*\*/.test(line);
        continue;
      }
      if (inStar && /^disallow:/i.test(line)) {
        const path = line.replace(/^disallow:/i, "").trim();
        if (path) disallows.push(path);
      }
    }
    const path = target.pathname || "/";
    for (const d of disallows) {
      if (d === "/") return false;
      if (path.startsWith(d)) return false;
    }
    return true;
  } catch {
    return true; // robots 判定に失敗しても本文取得はタイムアウト等で保護される
  }
}

function looksLikeGatedPage(url: URL, html: string): string | null {
  const u = url.href.toLowerCase();
  if (u.includes("/login") || u.includes("signin") || u.includes("/auth")) {
    return "ログインページのため対象外";
  }
  // 有料note等の簡易検知（本文が課金導線ばかり）
  const lower = html.toLowerCase();
  if (
    (lower.includes("この続きをみるには") ||
      lower.includes("有料") ||
      lower.includes("purchase") ||
      lower.includes("paywall")) &&
    lower.includes("note.com")
  ) {
    return "有料記事の可能性のため対象外";
  }
  return null;
}

async function fetchOne(rawUrl: string): Promise<FetchOutcome> {
  let target: URL;
  try {
    target = new URL(rawUrl);
  } catch {
    return { url: rawUrl, ok: false, status: "取得不可", reason: "URL不正" };
  }

  if (target.protocol !== "https:" && target.protocol !== "http:") {
    return { url: rawUrl, ok: false, status: "取得不可", reason: "非対応プロトコル" };
  }

  const allowed = await allowedByRobots(target);
  if (!allowed) {
    return {
      url: rawUrl,
      ok: false,
      status: "取得不可",
      reason: "robots.txt により禁止",
    };
  }

  try {
    const res = await timeoutFetch(target.href, TIMEOUT_MS, {
      "User-Agent": UA,
      Accept: "text/html",
    });
    if (!res.ok) {
      return {
        url: rawUrl,
        ok: false,
        status: "取得不可",
        reason: `HTTP ${res.status}`,
      };
    }
    const ct = res.headers.get("content-type") || "";
    if (!ct.includes("text/html")) {
      return {
        url: rawUrl,
        ok: false,
        status: "取得不可",
        reason: "HTMLではない",
      };
    }

    // サイズ上限つきで読み取り
    const reader = res.body?.getReader();
    if (!reader) {
      const html = await res.text();
      return finalize(target, rawUrl, html.slice(0, MAX_BYTES));
    }
    const chunks: Uint8Array[] = [];
    let total = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) {
        total += value.length;
        chunks.push(value);
        if (total > MAX_BYTES) {
          reader.cancel();
          break;
        }
      }
    }
    const html = new TextDecoder("utf-8").decode(concat(chunks));
    return finalize(target, rawUrl, html);
  } catch (e) {
    const reason =
      e instanceof Error && e.name === "AbortError"
        ? "タイムアウト"
        : "取得エラー";
    return { url: rawUrl, ok: false, status: "取得不可", reason };
  }
}

function concat(chunks: Uint8Array[]): Uint8Array {
  const len = chunks.reduce((a, c) => a + c.length, 0);
  const out = new Uint8Array(len);
  let off = 0;
  for (const c of chunks) {
    out.set(c, off);
    off += c.length;
  }
  return out;
}

function finalize(target: URL, rawUrl: string, html: string): FetchOutcome {
  const gated = looksLikeGatedPage(target, html);
  if (gated) {
    return { url: rawUrl, ok: false, status: "取得不可", reason: gated };
  }
  return { url: rawUrl, ok: true, status: "ok", html };
}

export async function POST(req: NextRequest) {
  let body: { url?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }
  if (!body.url) {
    return NextResponse.json({ error: "url required" }, { status: 400 });
  }
  const outcome = await fetchOne(body.url);
  return NextResponse.json(outcome);
}
