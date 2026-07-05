"use client";

import { useMemo, useState } from "react";
import { PredictionTable } from "../components/PredictionTable";
import { RaceSelector } from "../components/RaceSelector";
import { SourceUrlPanel } from "../components/SourceUrlPanel";
import { buildInitialRows, calculateScore, predictionSources, races } from "../lib/mock-data";
import type { Mark, PredictionRow, ScrapeResult } from "../lib/types";

export default function Home() {
  const [selectedRaceId, setSelectedRaceId] = useState(races[0].id);
  const selectedRace = races.find((race) => race.id === selectedRaceId) ?? races[0];
  const [manualRows, setManualRows] = useState<Record<string, PredictionRow[]>>({});
  const [urls, setUrls] = useState<Record<string, string>>({});
  const [scrapeResults, setScrapeResults] = useState<ScrapeResult[]>([]);
  const [loading, setLoading] = useState(false);

  const rows = useMemo(() => {
    return manualRows[selectedRace.id] ?? buildInitialRows(selectedRace);
  }, [manualRows, selectedRace]);

  function updateUrl(sourceId: string, url: string) {
    setUrls((prev) => ({ ...prev, [sourceId]: url }));
  }

  async function scrapeSources() {
    setLoading(true);
    setScrapeResults([]);
    try {
      const sources = predictionSources.map((source) => ({
        id: source.id,
        name: source.name,
        url: urls[source.id] ?? ""
      })).filter((source) => source.url.trim().length > 0);

      const response = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ raceName: selectedRace.raceName, sources })
      });
      const data = await response.json() as { results: ScrapeResult[] };
      setScrapeResults(data.results ?? []);

      const baseRows = rows.map((row) => ({ ...row, marks: { ...row.marks } }));
      for (const result of data.results ?? []) {
        for (const [horseNumber, mark] of Object.entries(result.extractedMarks)) {
          const row = baseRows.find((item) => item.number === Number(horseNumber));
          if (row) row.marks[result.sourceId] = mark as Mark;
        }
      }
      const recalculated = baseRows.map((row) => {
        const totals = calculateScore(row.marks);
        return { ...row, ...totals };
      });
      setManualRows((prev) => ({ ...prev, [selectedRace.id]: recalculated }));
    } finally {
      setLoading(false);
    }
  }

  const topHorse = [...rows].sort((a, b) => b.score - a.score)[0];

  return (
    <main className="page">
      <header className="hero">
        <div>
          <p className="eyebrow">中央・地方競馬 予想集約ダッシュボード</p>
          <h1>🏇 予想まとめ小部ちゃん</h1>
          <p className="lead">15人分の予想を馬番ごとに横並び表示。まずは仮データ＋URL取得で、個人用ダッシュボードとして動かします。</p>
        </div>
        <div className="hero-card">
          <span>現在の暫定1位</span>
          <strong>{topHorse?.number}番 {topHorse?.name}</strong>
          <small>総合点 {topHorse?.score} / ◎数 {topHorse?.winCount}</small>
        </div>
      </header>

      <RaceSelector races={races} selectedRaceId={selectedRace.id} onChangeRace={setSelectedRaceId} />

      <div className="dashboard-grid">
        <PredictionTable rows={rows} sources={predictionSources} />
        <aside className="ranking-card">
          <h2>◎ランキング</h2>
          {[...rows].sort((a, b) => b.winCount - a.winCount || b.score - a.score).slice(0, 5).map((row, index) => (
            <div className="rank-row" key={row.number}>
              <span>{index + 1}</span>
              <div>
                <strong>{row.number}番 {row.name}</strong>
                <small>◎ {row.winCount} / 点数 {row.score}</small>
              </div>
            </div>
          ))}
          <div className="ai-comment">
            <strong>AIコメント</strong>
            <p>現時点では総合点と◎数を重視。次フェーズで人気・オッズ・予想元の信頼度を加えて「妙味馬」を出します。</p>
          </div>
        </aside>
      </div>

      <SourceUrlPanel
        sources={predictionSources}
        urls={urls}
        onChangeUrl={updateUrl}
        onScrape={scrapeSources}
        loading={loading}
        results={scrapeResults}
      />
    </main>
  );
}
