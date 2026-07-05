// lib/parse-racecard.ts
//
// 出馬表の「貼り付けテキスト」を解析して Horse[] に変換する。
// netkeiba 等の出馬表ページから馬番・馬名・騎手・人気・オッズを含む行を
// コピペした想定。タブ区切り / 複数スペース区切り / 崩れた行にも耐えるよう
// 汎用的に推定する（サイト固有のDOM解析はしない）。

import { Horse, Mark, SOURCES } from "./mock-data";

export interface ParsedHorse {
  umaban: number;
  name: string;
  jockey: string;
  ninki: number;
  odds: number;
}

export interface ParseResult {
  horses: ParsedHorse[];
  skipped: number; // 解析できず飛ばした行数
  note?: string;
}

function toNumber(s: string): number | null {
  const cleaned = s.replace(/[^\d.]/g, "");
  if (!cleaned) return null;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

// 崩れた1行から正規表現で最低限（馬番・馬名・オッズ）を推定
function fallback(raw: string): ParsedHorse | null {
  const umM = raw.match(/(?:^|\s|　)(1[0-8]|[1-9])(?:\s|　)/);
  const nameM = raw.match(/[ァ-ヶー]{2,}/);
  const oddsM = raw.match(/\d+\.\d/);
  if (umM && nameM) {
    return {
      umaban: Number(umM[1]),
      name: nameM[0],
      jockey: "",
      ninki: 0,
      odds: oddsM ? Number(oddsM[0]) : 0,
    };
  }
  return null;
}

// 1行を解析。列区切りが明確ならそれを使い、無ければ正規表現で推定。
function parseLine(line: string): ParsedHorse | null {
  const raw = line.trim();
  if (!raw) return null;

  // タブ or 2個以上の空白で分割
  let cols = raw.split(/\t|\s{2,}/).map((c) => c.trim()).filter(Boolean);
  // 単一スペース区切りの表（コピー崩れ）にも対応：分割数が少なく、
  // 単一スペースを含むなら空白1個でも分割してみる
  if (cols.length < 4 && /\s/.test(raw)) {
    const alt = raw.split(/[\s　]+/).map((c) => c.trim()).filter(Boolean);
    if (alt.length > cols.length) cols = alt;
  }

  // --- パターンA: 列がきれいに分かれている場合 ---
  // 出馬表の並びはサイトで違うため、「馬名」を起点に前後で役割を推定する。
  if (cols.length >= 3) {
    // 馬名候補（カタカナ2文字以上で最長。斤量kg等の混入を避けるため単独カタカナセル）
    const nameCandidates = cols.filter((c) => /^[ァ-ヶー]{2,}$/.test(c));
    const name =
      nameCandidates.sort((a, b) => b.length - a.length)[0] || "";
    if (!name) return fallback(raw);
    const nameIdx = cols.indexOf(name);

    // 馬番: 馬名より前にある 1〜18 の整数（最も馬名寄りを採用）
    let umaban = 0;
    for (let i = nameIdx - 1; i >= 0; i--) {
      const n = toNumber(cols[i]);
      if (n !== null && Number.isInteger(n) && n >= 1 && n <= 18) {
        umaban = n;
        break;
      }
    }
    // 前方に無ければ全体から探す
    if (!umaban) {
      for (const c of cols) {
        const n = toNumber(c);
        if (n !== null && Number.isInteger(n) && n >= 1 && n <= 18) {
          umaban = n;
          break;
        }
      }
    }

    // 馬名より後ろのセル群を「後半」として役割推定
    const tail = cols.slice(nameIdx + 1);

    // 騎手: 後半の最初に現れる日本語トークン（漢字/ひらがな/カタカナ人名）。
    //   性齢(牡3等)・斤量(55.0)・数値は除外。印記号は除去。
    let jockey = "";
    for (const c of tail) {
      const cleaned = c.replace(/[▲△☆★◇◎○◯]/g, "").trim();
      if (!cleaned) continue;
      if (/^\d/.test(cleaned)) continue; // 数値始まりは斤量/オッズ等
      if (/^[牡牝せんセン騸]\d/.test(cleaned)) continue; // 性齢
      if (/^[ぁ-ん]?\d/.test(cleaned)) continue;
      if (/[一-龠々ぁ-んァ-ヶー]{2,}/.test(cleaned)) {
        jockey = cleaned;
        break;
      }
    }

    // 斤量らしき小数（整部 40〜70 かつ .0/.5）は除外候補
    const isWeight = (n: number) => {
      const ip = Math.floor(n);
      const frac = Math.round((n - ip) * 10);
      return ip >= 40 && ip <= 70 && (frac === 0 || frac === 5);
    };

    // オッズ: 後半の小数のうち、斤量らしきものを除いて右側優先。
    // 斤量しか無ければ採用しない（0のまま=不明）。
    let odds = 0;
    const decimals: number[] = [];
    for (const c of tail) {
      if (/^\d+\.\d+$/.test(c)) {
        const n = toNumber(c);
        if (n !== null && n >= 1 && n <= 9999) decimals.push(n);
      }
    }
    const nonWeight = decimals.filter((n) => !isWeight(n));
    if (nonWeight.length > 0) {
      odds = nonWeight[nonWeight.length - 1];
    }

    // 人気: 後半にある単独整数（斤量56や性齢を避けるため 1〜18、オッズ列以外）
    let ninki = 0;
    for (let i = tail.length - 1; i >= 0; i--) {
      const c = tail[i];
      if (/^\d+$/.test(c)) {
        const n = Number(c);
        if (n >= 1 && n <= 18) {
          ninki = n;
          break;
        }
      }
    }

    if (name && umaban) {
      return { umaban, name, jockey, ninki, odds };
    }
  }

  // --- パターンB: 崩れた1行から推定 ---
  return fallback(raw);
}

export function parseRacecard(text: string): ParseResult {
  const lines = text.split(/\r?\n/);
  const horses: ParsedHorse[] = [];
  let skipped = 0;
  const seen = new Set<number>();

  for (const line of lines) {
    const h = parseLine(line);
    if (!h) {
      if (line.trim()) skipped++;
      continue;
    }
    if (seen.has(h.umaban)) continue; // 同じ馬番の重複は無視
    seen.add(h.umaban);
    horses.push(h);
  }

  horses.sort((a, b) => a.umaban - b.umaban);

  return {
    horses,
    skipped,
    note:
      horses.length === 0
        ? "馬番と馬名を含む行が見つかりませんでした。出馬表の表部分を選択してコピーし直してください。"
        : undefined,
  };
}

// ParsedHorse[] を Horse[]（印は空で初期化）に変換
export function toHorses(parsed: ParsedHorse[]): Horse[] {
  const emptyMarks = (): Mark[] => SOURCES.map(() => "" as Mark);
  return parsed.map((p) => ({
    umaban: p.umaban,
    name: p.name,
    jockey: p.jockey,
    ninki: p.ninki,
    odds: p.odds,
    marks: emptyMarks(),
  }));
}
