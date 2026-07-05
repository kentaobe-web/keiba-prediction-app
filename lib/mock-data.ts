export type Mark = "◎" | "○" | "▲" | "△" | "☆" | "";

export type PredictionSource = {
  id: string;
  name: string;
  type: "新聞" | "AI" | "指数" | "note" | "メディア";
};

export type Horse = {
  number: number;
  name: string;
  jockey: string;
};

export type Race = {
  id: string;
  date: string;
  category: "中央競馬" | "地方競馬";
  course: string;
  raceName: string;
  startTime: string;
  horses: Horse[];
  predictions: Record<number, Record<string, Mark>>;
};

export const sources: PredictionSource[] = [
  { id: "tospo", name: "東スポ", type: "新聞" },
  { id: "nikkan", name: "日刊", type: "新聞" },
  { id: "sponichi", name: "スポニチ", type: "新聞" },
  { id: "sanspo", name: "サンスポ", type: "新聞" },
  { id: "book", name: "競馬ブック", type: "メディア" },
  { id: "netkeiba", name: "netkeiba", type: "メディア" },
  { id: "lab", name: "競馬ラボ", type: "メディア" },
  { id: "ai-a", name: "AI予想A", type: "AI" },
  { id: "ai-b", name: "AI予想B", type: "AI" },
  { id: "ai-c", name: "AI予想C", type: "AI" },
  { id: "index-a", name: "指数A", type: "指数" },
  { id: "index-b", name: "指数B", type: "指数" },
  { id: "note-a", name: "note予想A", type: "note" },
  { id: "note-b", name: "note予想B", type: "note" },
  { id: "ana", name: "穴馬AI", type: "AI" },
];

const marks: Mark[] = ["◎", "○", "▲", "△", "☆", ""];

function buildPredictions(horseCount: number, offset: number) {
  const result: Record<number, Record<string, Mark>> = {};
  for (let horse = 1; horse <= horseCount; horse++) {
    result[horse] = {};
    sources.forEach((source, index) => {
      result[horse][source.id] = marks[(horse + index + offset) % marks.length];
    });
  }
  return result;
}

export const races: Race[] = [
  {
    id: "jra-tokyo-11",
    date: "2026-07-05",
    category: "中央競馬",
    course: "東京",
    raceName: "東京11R メインレース",
    startTime: "15:45",
    horses: [
      { number: 1, name: "サンプルスター", jockey: "横山武" },
      { number: 2, name: "ネクストホープ", jockey: "戸崎" },
      { number: 3, name: "グランドライン", jockey: "ルメール" },
      { number: 4, name: "ミラクルゲート", jockey: "川田" },
      { number: 5, name: "ブルースカイ", jockey: "武豊" },
      { number: 6, name: "レッドアロー", jockey: "坂井" },
      { number: 7, name: "ゴールドシップス", jockey: "松山" },
      { number: 8, name: "ダイヤモンドラン", jockey: "岩田望" },
    ],
    predictions: buildPredictions(8, 1),
  },
  {
    id: "jra-hakodate-11",
    date: "2026-07-05",
    category: "中央競馬",
    course: "函館",
    raceName: "函館11R サマーステークス",
    startTime: "15:25",
    horses: [
      { number: 1, name: "ホッカイドリーム", jockey: "佐々木" },
      { number: 2, name: "シーサイドブルー", jockey: "浜中" },
      { number: 3, name: "ノースライト", jockey: "鮫島駿" },
      { number: 4, name: "ラストスパート", jockey: "池添" },
      { number: 5, name: "スノーファイター", jockey: "丹内" },
      { number: 6, name: "ミントグリーン", jockey: "藤岡佑" },
    ],
    predictions: buildPredictions(6, 2),
  },
  {
    id: "nar-oi-10",
    date: "2026-07-05",
    category: "地方競馬",
    course: "大井",
    raceName: "大井10R ナイトカップ",
    startTime: "19:30",
    horses: [
      { number: 1, name: "トーセンナイト", jockey: "笹川" },
      { number: 2, name: "オオイキング", jockey: "御神本" },
      { number: 3, name: "サザンライト", jockey: "矢野" },
      { number: 4, name: "ベイサイドラン", jockey: "本田重" },
      { number: 5, name: "ファイナルベル", jockey: "森泰斗" },
      { number: 6, name: "スピードロード", jockey: "和田譲" },
      { number: 7, name: "スターゲート", jockey: "達城" },
    ],
    predictions: buildPredictions(7, 3),
  },
];

export const markScore: Record<Mark, number> = {
  "◎": 5,
  "○": 4,
  "▲": 3,
  "△": 2,
  "☆": 1,
  "": 0,
};
