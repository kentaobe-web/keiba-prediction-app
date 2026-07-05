export type RaceType = "central" | "local";
export type Mark = "◎" | "○" | "▲" | "△" | "☆" | "";

export type PredictionSource = {
  id: string;
  name: string;
  category: "AI" | "新聞" | "メディア" | "note" | "指数" | "動画";
  reliability: number;
};

export type Horse = {
  number: number;
  name: string;
  jockey: string;
  popularity: number;
  odds: number;
};

export type Race = {
  id: string;
  date: string;
  type: RaceType;
  course: string;
  raceNo: string;
  name: string;
  startTime: string;
  horses: Horse[];
  predictions: Record<number, Record<string, Mark>>;
};

export const sources: PredictionSource[] = [
  { id: "ai-main", name: "AI本命", category: "AI", reliability: 5 },
  { id: "tospo", name: "東スポ", category: "新聞", reliability: 4 },
  { id: "nikkan", name: "日刊", category: "新聞", reliability: 4 },
  { id: "sponichi", name: "スポニチ", category: "新聞", reliability: 4 },
  { id: "sanspo", name: "サンスポ", category: "新聞", reliability: 3 },
  { id: "book", name: "競馬ブック", category: "メディア", reliability: 5 },
  { id: "netkeiba", name: "netkeiba", category: "メディア", reliability: 5 },
  { id: "lab", name: "競馬ラボ", category: "メディア", reliability: 3 },
  { id: "note-a", name: "note A", category: "note", reliability: 3 },
  { id: "note-b", name: "note B", category: "note", reliability: 2 },
  { id: "speed", name: "指数A", category: "指数", reliability: 4 },
  { id: "pace", name: "展開指数", category: "指数", reliability: 4 },
  { id: "youtube", name: "YouTube", category: "動画", reliability: 2 },
  { id: "ai-odds", name: "AIオッズ", category: "AI", reliability: 4 },
  { id: "ai-hole", name: "穴AI", category: "AI", reliability: 3 }
];

const sourceIds = sources.map((s) => s.id);

function makePredictions(seed: number, horses: Horse[]): Record<number, Record<string, Mark>> {
  const marks: Mark[] = ["◎", "○", "▲", "△", "☆", ""];
  const result: Record<number, Record<string, Mark>> = {};

  horses.forEach((horse) => {
    result[horse.number] = {};
    sourceIds.forEach((sourceId, sourceIndex) => {
      const value = (horse.number * 7 + sourceIndex * 5 + seed + horse.popularity) % marks.length;
      result[horse.number][sourceId] = marks[value];
    });
  });

  return result;
}

const centralHorses: Horse[] = [
  { number: 1, name: "サクラライトニング", jockey: "横山武", popularity: 3, odds: 6.4 },
  { number: 2, name: "ミッドナイトベル", jockey: "川田", popularity: 1, odds: 2.8 },
  { number: 3, name: "アオゾラキング", jockey: "武豊", popularity: 5, odds: 12.3 },
  { number: 4, name: "レッドブレイブ", jockey: "ルメール", popularity: 2, odds: 4.1 },
  { number: 5, name: "シルバーアロー", jockey: "戸崎", popularity: 8, odds: 25.6 },
  { number: 6, name: "ホクトスター", jockey: "佐々木", popularity: 6, odds: 16.8 },
  { number: 7, name: "グランヴェール", jockey: "坂井", popularity: 4, odds: 8.9 },
  { number: 8, name: "メイショウオーブ", jockey: "浜中", popularity: 10, odds: 41.2 },
  { number: 9, name: "ファストリズム", jockey: "松山", popularity: 7, odds: 19.7 },
  { number: 10, name: "ノーブルムーン", jockey: "北村友", popularity: 9, odds: 33.4 }
];

const localHorses: Horse[] = [
  { number: 1, name: "ナンカンエース", jockey: "森泰斗", popularity: 1, odds: 2.4 },
  { number: 2, name: "オオイファルコン", jockey: "笹川翼", popularity: 4, odds: 8.8 },
  { number: 3, name: "フナバシリュウ", jockey: "御神本", popularity: 2, odds: 4.5 },
  { number: 4, name: "カワサキスター", jockey: "矢野貴", popularity: 6, odds: 15.2 },
  { number: 5, name: "ホッカイドウノユメ", jockey: "落合玄", popularity: 3, odds: 6.9 },
  { number: 6, name: "ソノダプリンス", jockey: "吉村智", popularity: 5, odds: 11.1 },
  { number: 7, name: "コウチブラック", jockey: "赤岡修", popularity: 8, odds: 29.5 },
  { number: 8, name: "サガミハート", jockey: "山口勲", popularity: 7, odds: 20.4 }
];

export const races: Race[] = [
  {
    id: "central-hakodate-11",
    date: "2026-07-05",
    type: "central",
    course: "函館",
    raceNo: "11R",
    name: "巴賞",
    startTime: "15:25",
    horses: centralHorses,
    predictions: makePredictions(1, centralHorses)
  },
  {
    id: "central-fukushima-10",
    date: "2026-07-05",
    type: "central",
    course: "福島",
    raceNo: "10R",
    name: "猪苗代特別",
    startTime: "15:10",
    horses: centralHorses.slice(0, 8),
    predictions: makePredictions(4, centralHorses.slice(0, 8))
  },
  {
    id: "local-oi-11",
    date: "2026-07-05",
    type: "local",
    course: "大井",
    raceNo: "11R",
    name: "サマーナイト賞",
    startTime: "20:10",
    horses: localHorses,
    predictions: makePredictions(7, localHorses)
  },
  {
    id: "local-sonoda-10",
    date: "2026-07-05",
    type: "local",
    course: "園田",
    raceNo: "10R",
    name: "兵庫特別",
    startTime: "19:20",
    horses: localHorses.slice(0, 7),
    predictions: makePredictions(11, localHorses.slice(0, 7))
  }
];

export const markScore: Record<Mark, number> = {
  "◎": 5,
  "○": 4,
  "▲": 3,
  "△": 2,
  "☆": 1,
  "": 0
};

export function getScore(row: Record<string, Mark>) {
  return Object.values(row).reduce((sum, mark) => sum + markScore[mark], 0);
}

export function getHonmeiCount(row: Record<string, Mark>) {
  return Object.values(row).filter((mark) => mark === "◎").length;
}

export function getBestHorse(race: Race) {
  return [...race.horses]
    .map((horse) => ({
      ...horse,
      score: getScore(race.predictions[horse.number]),
      honmei: getHonmeiCount(race.predictions[horse.number])
    }))
    .sort((a, b) => b.score - a.score)[0];
}
