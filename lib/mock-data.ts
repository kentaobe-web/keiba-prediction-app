export type RaceType = "central" | "local";
export type Mark = "◎" | "○" | "▲" | "△" | "☆" | "消" | "";

export type Race = {
  id: string;
  date: string;
  raceType: RaceType;
  racecourse: string;
  raceNumber: number;
  raceName: string;
  startTime: string;
};

export type Horse = {
  id: string;
  raceId: string;
  horseNumber: number;
  frameNumber: number;
  horseName: string;
  jockey: string;
};

export type PredictionSource = {
  id: string;
  name: string;
  category: string;
};

export type Prediction = {
  raceId: string;
  horseId: string;
  sourceId: string;
  mark: Mark;
};

export const races: Race[] = [
  {
    id: "202607050511",
    date: "2026-07-05",
    raceType: "central",
    racecourse: "東京",
    raceNumber: 11,
    raceName: "サンプル重賞",
    startTime: "15:45",
  },
  {
    id: "202607054211",
    date: "2026-07-05",
    raceType: "local",
    racecourse: "大井",
    raceNumber: 11,
    raceName: "サンプル地方メイン",
    startTime: "20:10",
  },
];

export const predictionSources: PredictionSource[] = [
  { id: "tospo", name: "東スポ", category: "スポーツ紙" },
  { id: "sponichi", name: "スポニチ", category: "スポーツ紙" },
  { id: "nikkan", name: "日刊", category: "スポーツ紙" },
  { id: "sanspo", name: "サンスポ", category: "スポーツ紙" },
  { id: "book", name: "競馬ブック", category: "専門紙" },
  { id: "netkeiba", name: "netkeiba", category: "メディア" },
  { id: "labo", name: "競馬ラボ", category: "メディア" },
  { id: "ai-a", name: "AI予想A", category: "AI" },
  { id: "ai-b", name: "AI予想B", category: "AI" },
  { id: "index", name: "独自指数", category: "指数" },
  { id: "track", name: "競馬場情報", category: "公式系" },
];

export const horses: Horse[] = [
  { id: "h01", raceId: "202607050511", horseNumber: 1, frameNumber: 1, horseName: "アオゾラキング", jockey: "田辺" },
  { id: "h02", raceId: "202607050511", horseNumber: 2, frameNumber: 2, horseName: "サクラテンペスト", jockey: "横山武" },
  { id: "h03", raceId: "202607050511", horseNumber: 3, frameNumber: 3, horseName: "ミッドナイトベル", jockey: "戸崎" },
  { id: "h04", raceId: "202607050511", horseNumber: 4, frameNumber: 4, horseName: "レッドスフィア", jockey: "ルメール" },
  { id: "h05", raceId: "202607050511", horseNumber: 5, frameNumber: 5, horseName: "ゴールドライン", jockey: "川田" },
  { id: "h06", raceId: "202607050511", horseNumber: 6, frameNumber: 6, horseName: "ノースグランデ", jockey: "坂井" },
  { id: "h07", raceId: "202607050511", horseNumber: 7, frameNumber: 7, horseName: "スターライトラン", jockey: "武豊" },
  { id: "h08", raceId: "202607050511", horseNumber: 8, frameNumber: 8, horseName: "ブラックミラージュ", jockey: "岩田望" },
  { id: "l01", raceId: "202607054211", horseNumber: 1, frameNumber: 1, horseName: "オオイサンダー", jockey: "笹川" },
  { id: "l02", raceId: "202607054211", horseNumber: 2, frameNumber: 2, horseName: "トウキョウナイト", jockey: "森泰斗" },
  { id: "l03", raceId: "202607054211", horseNumber: 3, frameNumber: 3, horseName: "ベイサイドスター", jockey: "矢野" },
  { id: "l04", raceId: "202607054211", horseNumber: 4, frameNumber: 4, horseName: "ミナミノカゼ", jockey: "御神本" },
  { id: "l05", raceId: "202607054211", horseNumber: 5, frameNumber: 5, horseName: "サンライズオーシャン", jockey: "本田" },
];

const centralMarks: Record<string, Mark[]> = {
  h01: ["△", "", "△", "", "", "☆", "", "", "△", "", ""],
  h02: ["○", "▲", "○", "△", "▲", "○", "△", "▲", "○", "△", ""],
  h03: ["▲", "○", "▲", "○", "○", "▲", "▲", "○", "▲", "○", "△"],
  h04: ["◎", "◎", "○", "◎", "◎", "◎", "○", "◎", "◎", "◎", "○"],
  h05: ["○", "◎", "◎", "▲", "◎", "○", "◎", "○", "◎", "▲", "◎"],
  h06: ["☆", "△", "", "△", "△", "", "☆", "△", "", "☆", "△"],
  h07: ["△", "△", "☆", "☆", "", "△", "△", "☆", "△", "", "☆"],
  h08: ["消", "", "", "", "消", "", "", "", "", "消", ""],
};

const localMarks: Record<string, Mark[]> = {
  l01: ["△", "△", "", "", "△", "", "☆", "△", "", "", ""],
  l02: ["◎", "○", "◎", "○", "◎", "◎", "○", "◎", "○", "◎", "○"],
  l03: ["○", "◎", "○", "◎", "○", "○", "◎", "○", "◎", "○", "◎"],
  l04: ["▲", "▲", "△", "▲", "▲", "△", "▲", "▲", "△", "▲", "△"],
  l05: ["☆", "", "▲", "△", "", "☆", "△", "", "▲", "△", "☆"],
};

export const predictions: Prediction[] = [
  ...Object.entries(centralMarks).flatMap(([horseId, marks]) =>
    marks.map((mark, i) => ({ raceId: "202607050511", horseId, sourceId: predictionSources[i].id, mark }))
  ),
  ...Object.entries(localMarks).flatMap(([horseId, marks]) =>
    marks.map((mark, i) => ({ raceId: "202607054211", horseId, sourceId: predictionSources[i].id, mark }))
  ),
];

export function getRaceView(raceId: string) {
  const race = races.find((item) => item.id === raceId) ?? races[0];
  const raceHorses = horses
    .filter((horse) => horse.raceId === race.id)
    .sort((a, b) => a.horseNumber - b.horseNumber);
  const racePredictions = predictions.filter((prediction) => prediction.raceId === race.id);

  return {
    race,
    horses: raceHorses,
    sources: predictionSources,
    predictions: racePredictions,
  };
}

export function scoreMark(mark: Mark) {
  switch (mark) {
    case "◎":
      return 5;
    case "○":
      return 4;
    case "▲":
      return 3;
    case "△":
      return 2;
    case "☆":
      return 1;
    case "消":
      return -2;
    default:
      return 0;
  }
}
