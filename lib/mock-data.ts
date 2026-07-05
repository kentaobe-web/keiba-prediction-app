import type { Mark, PredictionRow, PredictionSource, Race } from "./types";

export const predictionSources: PredictionSource[] = [
  { id: "ai-main", name: "AI本命", type: "AI" },
  { id: "tospo", name: "東スポ", type: "新聞" },
  { id: "nikkan", name: "日刊", type: "新聞" },
  { id: "sponichi", name: "スポニチ", type: "新聞" },
  { id: "sanspo", name: "サンスポ", type: "新聞" },
  { id: "book", name: "競馬ブック", type: "新聞" },
  { id: "netkeiba", name: "netkeiba", type: "メディア" },
  { id: "lab", name: "競馬ラボ", type: "メディア" },
  { id: "note-a", name: "note A", type: "note" },
  { id: "note-b", name: "note B", type: "note" },
  { id: "index-a", name: "指数A", type: "指数" },
  { id: "index-b", name: "指数B", type: "指数" },
  { id: "ai-speed", name: "AI速度", type: "AI" },
  { id: "ai-value", name: "AI妙味", type: "AI" },
  { id: "manual", name: "手入力", type: "手入力" }
];

export const races: Race[] = [
  {
    id: "jra-hakodate-11",
    date: "2026-07-05",
    category: "中央競馬",
    course: "函館",
    raceName: "11R 巴賞",
    startTime: "15:25",
    horses: [
      { number: 1, name: "サンプルスター", jockey: "横山武" },
      { number: 2, name: "オベチャンドリーム", jockey: "戸崎" },
      { number: 3, name: "マトメキング", jockey: "川田" },
      { number: 4, name: "ダッシュボード", jockey: "武豊" },
      { number: 5, name: "ホースリンク", jockey: "坂井" },
      { number: 6, name: "ケイバノミカタ", jockey: "ルメール" },
      { number: 7, name: "ユメノバケン", jockey: "岩田望" },
      { number: 8, name: "アナウマサーチ", jockey: "菅原明" }
    ]
  },
  {
    id: "nar-oi-10",
    date: "2026-07-05",
    category: "地方競馬",
    course: "大井",
    raceName: "10R 小部ちゃん特別",
    startTime: "19:30",
    horses: [
      { number: 1, name: "ナンカンライト", jockey: "御神本" },
      { number: 2, name: "オオイノホシ", jockey: "矢野" },
      { number: 3, name: "ヨソウマトメ", jockey: "森泰斗" },
      { number: 4, name: "チホウノカゼ", jockey: "笹川" },
      { number: 5, name: "ナイトランナー", jockey: "和田譲" },
      { number: 6, name: "データブリッジ", jockey: "本田重" }
    ]
  }
];

const markScore: Record<Exclude<Mark, "">, number> = {
  "◎": 5,
  "○": 4,
  "▲": 3,
  "△": 2,
  "☆": 1
};

const sampleMarks: Mark[] = ["◎", "○", "▲", "△", "☆", ""];

export function buildInitialRows(race: Race): PredictionRow[] {
  return race.horses.map((horse, horseIndex) => {
    const marks = predictionSources.reduce<Record<string, Mark>>((acc, source, sourceIndex) => {
      const mark = sampleMarks[(horseIndex + sourceIndex * 2 + horse.number) % sampleMarks.length];
      acc[source.id] = mark;
      return acc;
    }, {});
    const values = Object.values(marks);
    const winCount = values.filter((mark) => mark === "◎").length;
    const score = values.reduce((total, mark) => total + (mark ? markScore[mark] : 0), 0);
    return { ...horse, marks, winCount, score };
  });
}

export function calculateScore(marks: Record<string, Mark>) {
  const values = Object.values(marks);
  return {
    winCount: values.filter((mark) => mark === "◎").length,
    score: values.reduce((total, mark) => total + (mark ? markScore[mark] : 0), 0)
  };
}
