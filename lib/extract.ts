// lib/extract.ts
//
// 汎用抽出エンジン（サイト固有のセレクタは持たない）。
// 任意のHTML文字列から「印・馬番・馬名」らしきものを推定して拾う。
// 特定サイトの構造に依存しないので、規約で許可されたどのページにも使える。

export type ExtractMark = "◎" | "○" | "▲" | "△" | "☆";

export const MARK_CHARS: ExtractMark[] = ["◎", "○", "▲", "△", "☆"];

// 全角・別記号のゆらぎを正規化
const MARK_NORMALIZE: Record<string, ExtractMark> = {
  "◎": "◎",
  "○": "○",
  "◯": "○",
  "〇": "○",
  "▲": "▲",
  "△": "△",
  "☆": "☆",
  "★": "☆",
};

export interface ExtractedRow {
  umaban?: number; // 馬番（拾えれば）
  horseName?: string; // 馬名（拾えれば）
  mark: ExtractMark; // 検出した印
  raw: string; // 抽出元の周辺テキスト（デバッグ/確認用）
}

export interface ExtractResult {
  rows: ExtractedRow[];
  markCount: number;
  note?: string;
}

// HTMLタグを除去してプレーンテキスト化（軽量・依存なし）
function stripHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

// 馬番らしき整数（1〜18）を周辺から拾う
function findUmaban(segment: string): number | undefined {
  const m = segment.match(/(?:^|[^\d])(1[0-8]|[1-9])(?:番|[^\d]|$)/);
  if (!m) return undefined;
  const n = Number(m[1]);
  return n >= 1 && n <= 18 ? n : undefined;
}

// 馬名らしき連続カタカナ（3文字以上）を拾う
function findHorseName(segment: string): string | undefined {
  const m = segment.match(/[ァ-ヶー]{3,}/);
  return m ? m[0] : undefined;
}

// メイン抽出関数
export function extractMarks(html: string): ExtractResult {
  const text = stripHtml(html);
  if (!text) return { rows: [], markCount: 0, note: "本文なし" };

  const rows: ExtractedRow[] = [];
  const seen = new Set<string>();

  // 印文字を1つずつ走査し、その前後の文脈から馬番・馬名を推定
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const mark = MARK_NORMALIZE[ch];
    if (!mark) continue;

    const start = Math.max(0, i - 12);
    const end = Math.min(text.length, i + 20);
    const window = text.slice(start, end);

    const umaban = findUmaban(window);
    const horseName = findHorseName(window);

    // 馬番も馬名も取れない印は誤検出（記事装飾等）の可能性が高いので除外
    if (umaban === undefined && !horseName) continue;

    const key = `${mark}-${umaban ?? ""}-${horseName ?? ""}`;
    if (seen.has(key)) continue;
    seen.add(key);

    rows.push({ umaban, horseName, mark, raw: window.trim() });
  }

  return {
    rows,
    markCount: rows.length,
    note: rows.length === 0 ? "印検出なし" : undefined,
  };
}
