export type Mark = '◎' | '○' | '▲' | '△' | '☆' | '';

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
  category: '中央競馬' | '地方競馬';
  course: string;
  raceNo: string;
  raceName: string;
  horses: Horse[];
};

export type Source = {
  id: string;
  name: string;
  type: string;
  url: string;
  reliability: number;
};

export const sources: Source[] = [
  { id: 'ai-main', name: 'AI本命', type: 'AI', url: '自動検索予定', reliability: 5 },
  { id: 'tospo', name: '東スポ', type: '新聞', url: '自動検索予定', reliability: 4 },
  { id: 'nikkan', name: '日刊', type: '新聞', url: '自動検索予定', reliability: 4 },
  { id: 'sponichi', name: 'スポニチ', type: '新聞', url: '自動検索予定', reliability: 4 },
  { id: 'sanspo', name: 'サンスポ', type: '新聞', url: '自動検索予定', reliability: 4 },
  { id: 'book', name: '競馬ブック', type: '専門紙', url: '自動検索予定', reliability: 5 },
  { id: 'lab', name: '競馬ラボ', type: 'メディア', url: '自動検索予定', reliability: 4 },
  { id: 'netkeiba', name: 'netkeiba', type: 'メディア', url: '自動検索予定', reliability: 5 },
  { id: 'index-a', name: '指数A', type: '指数', url: '自動検索予定', reliability: 3 },
  { id: 'index-b', name: '指数B', type: '指数', url: '自動検索予定', reliability: 3 },
  { id: 'note-a', name: 'note①', type: '個人', url: '自動検索予定', reliability: 3 },
  { id: 'note-b', name: 'note②', type: '個人', url: '自動検索予定', reliability: 3 },
  { id: 'youtube', name: 'YouTube', type: '動画', url: '自動検索予定', reliability: 3 },
  { id: 'local-ai', name: '地方AI', type: '地方', url: '自動検索予定', reliability: 3 },
  { id: 'other', name: 'その他', type: '候補', url: '自動検索予定', reliability: 2 },
];

export const races: Race[] = [
  {
    id: 'tokyo-11', date: '2026-07-05', category: '中央競馬', course: '東京', raceNo: '11R', raceName: 'メインレース',
    horses: [
      { number: 1, name: 'サンプルホースA', jockey: '横山武', popularity: 4, odds: 8.2 },
      { number: 2, name: 'サンプルホースB', jockey: '川田', popularity: 1, odds: 2.8 },
      { number: 3, name: 'サンプルホースC', jockey: '武豊', popularity: 8, odds: 24.1 },
      { number: 4, name: 'サンプルホースD', jockey: 'ルメール', popularity: 2, odds: 4.1 },
      { number: 5, name: 'サンプルホースE', jockey: '戸崎', popularity: 6, odds: 15.5 },
      { number: 6, name: 'サンプルホースF', jockey: '坂井', popularity: 9, odds: 31.2 },
      { number: 7, name: 'サンプルホースG', jockey: '松山', popularity: 3, odds: 6.7 },
      { number: 8, name: 'サンプルホースH', jockey: '岩田望', popularity: 7, odds: 20.8 },
    ],
  },
  {
    id: 'ooi-11', date: '2026-07-05', category: '地方競馬', course: '大井', raceNo: '11R', raceName: '地方メインレース',
    horses: [
      { number: 1, name: 'ローカルスターA', jockey: '御神本', popularity: 2, odds: 4.4 },
      { number: 2, name: 'ローカルスターB', jockey: '笹川', popularity: 1, odds: 2.5 },
      { number: 3, name: 'ローカルスターC', jockey: '矢野', popularity: 5, odds: 10.7 },
      { number: 4, name: 'ローカルスターD', jockey: '森泰斗', popularity: 3, odds: 6.1 },
      { number: 5, name: 'ローカルスターE', jockey: '本田正', popularity: 7, odds: 18.3 },
      { number: 6, name: 'ローカルスターF', jockey: '和田譲', popularity: 4, odds: 8.8 },
    ],
  },
];

const marks: Mark[] = ['◎', '○', '▲', '△', '☆', ''];

export function getMark(raceId: string, horseNumber: number, sourceIndex: number): Mark {
  const seed = raceId.length + horseNumber * 7 + sourceIndex * 5;
  return marks[seed % marks.length];
}

export function markScore(mark: Mark): number {
  if (mark === '◎') return 5;
  if (mark === '○') return 4;
  if (mark === '▲') return 3;
  if (mark === '△') return 2;
  if (mark === '☆') return 1;
  return 0;
}

export function consensusForHorse(race: Race, horse: Horse) {
  const sourceMarks = sources.map((source, index) => ({ source, mark: getMark(race.id, horse.number, index) }));
  const honmeiCount = sourceMarks.filter((item) => item.mark === '◎').length;
  const totalScore = sourceMarks.reduce((sum, item) => sum + markScore(item.mark), 0);
  const gapScore = Math.max(0, horse.popularity - (honmeiCount + 1));
  return { sourceMarks, honmeiCount, totalScore, gapScore };
}
