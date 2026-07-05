export type Mark = "◎" | "○" | "▲" | "△" | "☆" | "";

export type PredictionSource = {
  id: string;
  name: string;
  type: "AI" | "新聞" | "note" | "指数" | "メディア" | "手入力";
  url?: string;
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
};

export type PredictionRow = Horse & {
  marks: Record<string, Mark>;
  winCount: number;
  score: number;
};

export type ScrapeResult = {
  sourceId: string;
  sourceName: string;
  url: string;
  ok: boolean;
  message: string;
  extractedMarks: Record<number, Mark>;
  pageTitle?: string;
};
