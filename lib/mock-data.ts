// lib/mock-data.ts
// 仮データ。外部API/スクレイピングは未実装。

export type Mark = "◎" | "○" | "▲" | "△" | "☆" | "";

export const MARK_SCORE: Record<Mark, number> = {
  "◎": 5,
  "○": 4,
  "▲": 3,
  "△": 2,
  "☆": 1,
  "": 0,
};

// 15人分の予想元
export const SOURCES: string[] = [
  "東スポ",
  "スポニチ",
  "日刊",
  "サンスポ",
  "競馬ブック",
  "競馬ラボ",
  "netkeiba",
  "AI予想A",
  "AI予想B",
  "AI予想C",
  "note予想A",
  "note予想B",
  "指数A",
  "指数B",
  "YouTube",
];

export interface Horse {
  umaban: number; // 馬番
  name: string; // 馬名
  jockey: string; // 騎手
  ninki: number; // 人気
  odds: number; // オッズ
  marks: Mark[]; // 予想元ごとの印（SOURCES と同じ並び・同じ長さ）
}

export interface RaceMeta {
  id: string;
  date: string; // 開催日
  category: "中央" | "地方";
  track: string; // 競馬場
  raceName: string; // レース名
}

export const RACE_DATES: string[] = ["2026-07-05", "2026-07-06"];

export const TRACKS: Record<"中央" | "地方", string[]> = {
  中央: ["東京", "中山", "阪神", "京都", "福島", "小倉"],
  地方: ["大井", "船橋", "川崎", "浦和", "門別", "園田"],
};

export const CURRENT_RACE: RaceMeta = {
  id: "20260705-tokyo-11",
  date: "2026-07-05",
  category: "中央",
  track: "東京",
  raceName: "11R メインステークス (G3)",
};

// 印生成ヘルパ（仮データ用）
function m(...arr: Mark[]): Mark[] {
  const out = arr.slice(0, SOURCES.length);
  while (out.length < SOURCES.length) out.push("");
  return out;
}

export const HORSES: Horse[] = [
  {
    umaban: 1,
    name: "サンライズホープ",
    jockey: "武豊",
    ninki: 1,
    odds: 2.4,
    marks: m("◎", "◎", "○", "◎", "○", "◎", "◎", "○", "◎", "○", "◎", "△", "◎", "○", "◎"),
  },
  {
    umaban: 2,
    name: "ミッドナイトラン",
    jockey: "ルメール",
    ninki: 2,
    odds: 3.8,
    marks: m("○", "○", "◎", "○", "◎", "○", "○", "◎", "○", "◎", "○", "◎", "○", "◎", "○"),
  },
  {
    umaban: 3,
    name: "テツノカゲロウ",
    jockey: "川田将雅",
    ninki: 3,
    odds: 6.1,
    marks: m("▲", "△", "○", "▲", "△", "▲", "△", "▲", "△", "▲", "△", "○", "▲", "△", "▲"),
  },
  {
    umaban: 4,
    name: "アオイシグナル",
    jockey: "戸崎圭太",
    ninki: 7,
    odds: 18.9,
    marks: m("○", "▲", "◎", "△", "○", "☆", "▲", "○", "▲", "△", "◎", "▲", "△", "○", "▲"),
  },
  {
    umaban: 5,
    name: "グランドフィナーレ",
    jockey: "横山武史",
    ninki: 4,
    odds: 8.5,
    marks: m("△", "△", "△", "△", "▲", "△", "△", "△", "△", "▲", "△", "△", "△", "△", "△"),
  },
  {
    umaban: 6,
    name: "シルバースコール",
    jockey: "松山弘平",
    ninki: 9,
    odds: 41.2,
    marks: m("☆", "", "☆", "☆", "", "☆", "", "☆", "", "☆", "", "☆", "", "☆", ""),
  },
  {
    umaban: 7,
    name: "ハルカゼノオト",
    jockey: "岩田望来",
    ninki: 5,
    odds: 11.3,
    marks: m("▲", "○", "△", "▲", "△", "▲", "○", "△", "▲", "△", "▲", "△", "○", "▲", "△"),
  },
  {
    umaban: 8,
    name: "レッドコメット",
    jockey: "坂井瑠星",
    ninki: 12,
    odds: 78.4,
    marks: m("☆", "", "", "☆", "", "", "☆", "", "", "☆", "", "", "☆", "", ""),
  },
  {
    umaban: 9,
    name: "ノーザンブライト",
    jockey: "西村淳也",
    ninki: 6,
    odds: 14.7,
    marks: m("△", "☆", "▲", "☆", "△", "△", "☆", "▲", "△", "☆", "△", "▲", "☆", "△", "☆"),
  },
  {
    umaban: 10,
    name: "エクリプスゲート",
    jockey: "菅原明良",
    ninki: 8,
    odds: 24.6,
    marks: m("", "☆", "", "△", "☆", "", "△", "", "☆", "", "△", "", "☆", "", "△"),
  },
];
