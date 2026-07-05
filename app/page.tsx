"use client";

import { useMemo, useState } from "react";
import { PredictionTable } from "../components/PredictionTable";
import { RaceSelector } from "../components/RaceSelector";
import { getBestHorse, races, sources } from "../lib/mock-data";

export default function Home() {
  const [selectedRaceId, setSelectedRaceId] = useState(races[0].id);
  const selectedRace = useMemo(
    () => races.find((race) => race.id === selectedRaceId) ?? races[0],
    [selectedRaceId]
  );
  const bestHorse = getBestHorse(selectedRace);

  return (
    <main className="page-shell">
      <header className="hero">
        <div>
          <p className="app-kicker">中央・地方競馬 予想集約ダッシュボード</p>
          <h1>🏇 予想まとめ小部ちゃん</h1>
          <p className="hero-text">
            AI・新聞・note・指数系など15ソースの印を、馬番ごとに横並びで比較します。
          </p>
        </div>
        <div className="status-box">
          <span>Version</span>
          <strong>v0.1 MVP</strong>
          <small>仮データ表示</small>
        </div>
      </header>

      <RaceSelector races={races} selectedRaceId={selectedRace.id} onRaceChange={setSelectedRaceId} />

      <section className="race-summary">
        <div className="summary-main">
          <p className="eyebrow">選択中レース</p>
          <h2>{selectedRace.course} {selectedRace.raceNo} {selectedRace.name}</h2>
          <p>{selectedRace.date} / 発走 {selectedRace.startTime} / {selectedRace.type === "central" ? "中央競馬" : "地方競馬"}</p>
        </div>
        <div className="summary-card highlight">
          <span>総合1位</span>
          <strong>{bestHorse.number}. {bestHorse.name}</strong>
          <small>◎{bestHorse.honmei} / {bestHorse.score}点</small>
        </div>
        <div className="summary-card">
          <span>予想ソース</span>
          <strong>{sources.length}件</strong>
          <small>AI・新聞・note・指数</small>
        </div>
      </section>

      <PredictionTable race={selectedRace} />

      <section className="source-panel">
        <div>
          <p className="eyebrow">次フェーズ</p>
          <h2>予想元URL登録</h2>
          <p>次に、ここへ東スポ・note・AI予想などのURLを貼って、AI抽出する機能を作ります。</p>
        </div>
        <div className="url-grid">
          <input readOnly value="https://example.com/tospo-race-yoso" />
          <input readOnly value="https://note.com/sample-yosoka" />
          <button type="button">URL登録機能は次回追加</button>
        </div>
      </section>
    </main>
  );
}
