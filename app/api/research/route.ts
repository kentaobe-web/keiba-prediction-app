// app/api/research/route.ts
//
// 渡された登録URL一覧から予想を取得し、汎用抽出で印を抜き出して返す。
//  - URL一覧はリクエストボディで受け取る（UI/localStorage 管理のため）
//  - fetch-url を内部利用（robots/タイムアウト/ゲート検知）
//  - 連続大量アクセスを避けるため直列 + 各アクセス間に待機
//  - 取れたものだけ ok。取れないものは status と理由を返す。

import { NextRequest, NextResponse } from "next/server";
import { resolveUrl, RaceContext, ResearchSource } from "@/lib/research-sources";
import { extractMarks } from "@/lib/extract";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const POLITE_DELAY_MS = 1200;

interface SourceResult {
  source: string;
  url: string;
  status: "ok" | "取得不可" | "印検出なし";
  reason?: string;
  markCount: number;
  rows: ReturnType<typeof extractMarks>["rows"];
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function POST(req: NextRequest) {
  let body: { ctx?: RaceContext; sources?: ResearchSource[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const ctx: RaceContext = body.ctx ?? { track: "", raceNo: "", raceName: "" };
  const enabled = (body.sources ?? []).filter((s) => s.enabled && s.urlTemplate);

  if (enabled.length === 0) {
    return NextResponse.json({
      ctx,
      empty: true,
      message:
        "取得対象URLが未登録です。「URL設定」から、規約・robots.txt で許可されたURLを登録してください。",
      results: [] as SourceResult[],
    });
  }

  const endpoint = `${req.nextUrl.origin}/api/fetch-url`;
  const results: SourceResult[] = [];

  for (const src of enabled) {
    const url = resolveUrl(src.urlTemplate, ctx);
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();

      if (!data.ok || !data.html) {
        results.push({
          source: src.source,
          url,
          status: "取得不可",
          reason: data.reason ?? "取得失敗",
          markCount: 0,
          rows: [],
        });
      } else {
        const extracted = extractMarks(data.html);
        if (extracted.markCount === 0) {
          results.push({
            source: src.source,
            url,
            status: "印検出なし",
            markCount: 0,
            rows: [],
          });
        } else {
          results.push({
            source: src.source,
            url,
            status: "ok",
            markCount: extracted.markCount,
            rows: extracted.rows,
          });
        }
      }
    } catch {
      results.push({
        source: src.source,
        url,
        status: "取得不可",
        reason: "内部エラー",
        markCount: 0,
        rows: [],
      });
    }
    await sleep(POLITE_DELAY_MS);
  }

  return NextResponse.json({ ctx, empty: false, results });
}
