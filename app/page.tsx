"use client";

import { useEffect, useMemo, useState } from "react";
import RaceSelector, { RaceSelection } from "@/components/RaceSelector";
import PredictionTable from "@/components/PredictionTable";
import InsightCards from "@/components/InsightCards";
import ResearchStatus, { SourceStatus } from "@/components/ResearchStatus";
import SourceManager from "@/components/SourceManager";
import { HORSES, CURRENT_RACE, SOURCES, Horse, Mark } from "@/lib/mock-data";
import { ResearchSource } from "@/lib/research-sources";
import {
  computeStats,
  pickHonmei,
  pickAnauma,
  pickKiken,
} from "@/lib/analysis";

const RESULT_KEY = "kobu-chan:research:v1";
const SOURCES_KEY = "kobu-chan:sources:v1";

interface ResearchRow {
  umaban?: number;
  horseName?: string;
  mark: string;
}
interface ResearchResult {
  source: string;
  url: string;
  status: "ok" | "取得不可" | "印検出なし";
  reason?: string;
  markCount: number;
  rows: ResearchRow[];
}

function isMark(s: string): boolean {
  return s === "◎" || s === "○" || s === "▲" || s === "△" || s === "☆";
}

function mergeIntoHorses(base: Horse[], results: ResearchResult[]): Horse[] {
  const horses = base.map((h) => ({ ...h, marks: [...h.marks] as Mark[] }));
  for (const r of results) {
    if (r.status !== "ok") continue;
    const col = SOURCES.indexOf(r.source);
    if (col < 0) continue;
    for (const row of r.rows) {
      let idx = -1;
      if (row.umaban !== undefined) {
        idx = horses.findIndex((h) => h.umaban === row.umaban);
      }
      if (idx < 0 && row.horseName) {
        idx = horses.findIndex((h) => h.name === row.horseName);
      }
      if (idx >= 0 && isMark(row.mark)) {
        horses[idx].marks[col] = row.mark as Mark;
      }
    }
  }
  return horses;
}

export default function Page() {
  const [selection, setSelection] = useState<RaceSelection>({
    date: CURRENT_RACE.date,
    category: CURRENT_RACE.category,
    track: CURRENT_RACE.track,
    raceNo: "11R",
    raceName: CURRENT_RACE.raceName,
  });

  const [loading, setLoading] = useState(false);
  const [statuses, setStatuses] = useState<SourceStatus[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [horses, setHorses] = useState<Horse[]>(HORSES);
  const [urlSources, setUrlSources] = useState<ResearchSource[]>([]);

  // 初期ロード: URL設定（localStorage優先→無ければサーバのJSON）、結果の復元
  useEffect(() => {
    (async () => {
      let loaded = false;
      try {
        const rawSrc = localStorage.getItem(SOURCES_KEY);
        if (rawSrc) {
          setUrlSources(JSON.parse(rawSrc));
          loaded = true;
        }
      } catch {
        /* ignore */
      }
      if (!loaded) {
        try {
          const res = await fetch("/api/sources");
          const data = await res.json();
          if (Array.isArray(data.sources)) setUrlSources(data.sources);
        } catch {
          /* ignore */
        }
      }
      try {
        const raw = localStorage.getItem(RESULT_KEY);
        if (raw) {
          const saved = JSON.parse(raw) as {
            results: ResearchResult[];
            statuses: SourceStatus[];
          };
          if (saved.results) setHorses(mergeIntoHorses(HORSES, saved.results));
          if (saved.statuses) setStatuses(saved.statuses);
        }
      } catch {
        /* ignore */
      }
    })();
  }, []);

  // URL設定の変更を localStorage に保存（+ サーバへもベストエフォート）
  function handleSourcesChange(next: ResearchSource[]) {
    setUrlSources(next);
    try {
      localStorage.setItem(SOURCES_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
    fetch("/api/sources", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sources: next }),
    }).catch(() => {
      /* 読み取り専用環境では失敗してOK（localStorageが主） */
    });
  }

  const stats = useMemo(() => computeStats(horses), [horses]);
  const honmei = useMemo(() => pickHonmei(stats), [stats]);
  const anauma = useMemo(() => pickAnauma(stats), [stats]);
  const kiken = useMemo(() => pickKiken(stats), [stats]);

  async function handleResearch() {
    setLoading(true);
    setMessage(null);
    try {
      const track = selection.track.replace(/競馬場$/, "");
      const res = await fetch("/api/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ctx: {
            track,
            raceNo: selection.raceNo,
            raceName: selection.raceName,
          },
          sources: urlSources,
        }),
      });
      const data = await res.json();

      if (data.empty) {
        setMessage(data.message ?? "取得対象URLが未登録です。");
        setStatuses([]);
        return;
      }

      const results = (data.results ?? []) as ResearchResult[];
      const newStatuses: SourceStatus[] = results.map((r) => ({
        source: r.source,
        url: r.url,
        status: r.status,
        reason: r.reason,
        markCount: r.markCount,
      }));

      setHorses(mergeIntoHorses(HORSES, results));
      setStatuses(newStatuses);

      try {
        localStorage.setItem(
          RESULT_KEY,
          JSON.stringify({ results, statuses: newStatuses })
        );
      } catch {
        /* ignore */
      }
    } catch {
      setMessage("取得中にエラーが発生しました。");
    } finally {
      setLoading(false);
    }
  }

  function handleClear() {
    setHorses(HORSES);
    setStatuses([]);
    setMessage(null);
    try {
      localStorage.removeItem(RESULT_KEY);
    } catch {
      /* ignore */
    }
  }

  return (
    <main className="page">
      <header className="site-header">
        <h1 className="site-title">予想まとめ小部ちゃん</h1>
        <p className="site-subtitle">中央・地方競馬 予想集約ダッシュボード</p>
      </header>

      <RaceSelector
        value={selection}
        onChange={setSelection}
        onResearch={handleResearch}
        loading={loading}
      />

      <SourceManager sources={urlSources} onChange={handleSourcesChange} />

      <div className="race-heading">
        <span
          className={`badge badge-${
            selection.category === "中央" ? "central" : "local"
          }`}
        >
          {selection.category}
        </span>
        <span className="race-heading-text">
          {selection.date}　{selection.track}　{selection.raceNo}{" "}
          {selection.raceName}
        </span>
        <button className="clear-btn" onClick={handleClear}>
          取得結果をクリア
        </button>
      </div>

      {message && <div className="notice">{message}</div>}

      <ResearchStatus statuses={statuses} />

      <InsightCards honmei={honmei} anauma={anauma} kiken={kiken} />

      <PredictionTable stats={stats} honmeiUmaban={honmei?.horse.umaban} />

      <footer className="site-footer">
        ※ 取得は登録済みURL候補のみ対象。robots.txt・利用規約を尊重し、
        ログイン必須/有料ページは対象外。個人利用前提。
      </footer>
    </main>
  );
}
