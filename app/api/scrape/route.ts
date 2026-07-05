import { NextResponse } from "next/server";
import type { Mark, ScrapeResult } from "../../../lib/types";

export const dynamic = "force-dynamic";

const marks: Mark[] = ["◎", "○", "▲", "△", "☆"];

type RequestBody = {
  raceName: string;
  sources: Array<{ id: string; name: string; url: string }>;
};

function stripHtml(html: string) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function extractTitle(html: string) {
  const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return match ? stripHtml(match[1]).slice(0, 80) : undefined;
}

function extractMarks(text: string): Record<number, Mark> {
  const result: Record<number, Mark> = {};
  const normalized = text.replace(/[\u2460-\u2473]/g, (char) => String(char.charCodeAt(0) - 9311));

  // Pattern examples:
  // ◎ 3, ◎3, 3 ◎, 馬番3 ◎, 3番 ◎
  for (const mark of marks) {
    const before = new RegExp(`${mark}\\s*(?:馬番|馬)?\\s*([0-9]{1,2})`, "g");
    const after = new RegExp(`(?:馬番|馬)?\\s*([0-9]{1,2})\\s*(?:番)?\\s*${mark}`, "g");

    for (const regex of [before, after]) {
      let match: RegExpExecArray | null;
      while ((match = regex.exec(normalized)) !== null) {
        const num = Number(match[1]);
        if (num >= 1 && num <= 30 && !result[num]) {
          result[num] = mark;
        }
      }
    }
  }

  return result;
}

async function fetchOne(source: { id: string; name: string; url: string }): Promise<ScrapeResult> {
  try {
    const response = await fetch(source.url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; YosoMatomeObechan/0.2; personal dashboard)",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
      },
      cache: "no-store"
    });

    if (!response.ok) {
      return {
        sourceId: source.id,
        sourceName: source.name,
        url: source.url,
        ok: false,
        message: `取得失敗: HTTP ${response.status}`,
        extractedMarks: {}
      };
    }

    const html = await response.text();
    const title = extractTitle(html);
    const text = stripHtml(html);
    const extractedMarks = extractMarks(text);
    const count = Object.keys(extractedMarks).length;

    return {
      sourceId: source.id,
      sourceName: source.name,
      url: source.url,
      ok: count > 0,
      message: count > 0 ? `${count}件の印候補を抽出` : "印を自動検出できませんでした。手入力または抽出ルール追加が必要です。",
      extractedMarks,
      pageTitle: title
    };
  } catch (error) {
    return {
      sourceId: source.id,
      sourceName: source.name,
      url: source.url,
      ok: false,
      message: error instanceof Error ? error.message : "取得エラー",
      extractedMarks: {}
    };
  }
}

export async function POST(request: Request) {
  const body = (await request.json()) as RequestBody;
  const validSources = body.sources.filter((source) => source.url.startsWith("http"));

  if (validSources.length === 0) {
    return NextResponse.json({ results: [], message: "URLが入力されていません。" });
  }

  // 個人利用向け。大量アクセスを避けるため、並列数は抑える。
  const results: ScrapeResult[] = [];
  for (const source of validSources.slice(0, 15)) {
    results.push(await fetchOne(source));
  }

  return NextResponse.json({ results, message: `${results.length}件のURLを確認しました。` });
}
