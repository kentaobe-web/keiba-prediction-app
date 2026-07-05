// lib/research-sources.ts
//
// 取得対象URLの型と、レース用キーワード生成ヘルパ。
// 実際のURLは data/source-urls.json で管理し、UIから編集します。
//
// ⚠️ 登録してよいのは、取得許可があるURL、または利用規約・robots.txt で
//    自動取得が明確に禁止されていないページだけです。
//    ログイン必須・有料記事は登録しないでください。

import { SOURCES } from "./mock-data";

export interface ResearchSource {
  id: string; // 一意ID
  source: string; // 予想元名（SOURCES のいずれかに一致で該当列へ反映）
  urlTemplate: string; // URL（{track}{raceNo}{raceName} を置換可）
  enabled: boolean;
}

export interface SourceUrlFile {
  note?: string;
  sources: ResearchSource[];
}

export interface RaceContext {
  track: string;
  raceNo: string;
  raceName: string;
}

export function buildSearchKeywords(ctx: RaceContext): string[] {
  const r = `${ctx.track}${ctx.raceNo}`;
  return [
    `${r} 予想`,
    `${ctx.raceName} 予想 ◎`,
    `${r} AI予想`,
    `${r} note 予想 無料`,
    `${r} 競馬ラボ 予想`,
    `${r} スポニチ 予想`,
    `${r} 日刊 予想`,
    `${r} 東スポ 予想`,
  ];
}

export function resolveUrl(tpl: string, ctx: RaceContext): string {
  return tpl
    .replaceAll("{track}", encodeURIComponent(ctx.track))
    .replaceAll("{raceNo}", encodeURIComponent(ctx.raceNo))
    .replaceAll("{raceName}", encodeURIComponent(ctx.raceName));
}

export function isKnownSource(name: string): boolean {
  return SOURCES.includes(name);
}

export function newSourceId(): string {
  return `src_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}
