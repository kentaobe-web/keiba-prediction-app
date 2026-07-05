'use client';

import { useMemo, useState } from 'react';
import RaceSelector from '@/components/RaceSelector';
import PredictionTable from '@/components/PredictionTable';
import Insights from '@/components/Insights';
import { races } from '@/lib/mock-data';

export default function Home() {
  const [selectedRaceId, setSelectedRaceId] = useState(races[0].id);
  const selectedRace = useMemo(() => races.find((race) => race.id === selectedRaceId) ?? races[0], [selectedRaceId]);

  return (
    <main className="page">
      <header className="hero">
        <div>
          <p className="eyebrow">AI競馬リサーチ・ダッシュボード</p>
          <h1>🏇 予想まとめ小部ちゃん</h1>
          <p className="lead">中央・地方競馬の予想を15ソースで横並び比較。次STEPで実サイト巡回を接続します。</p>
        </div>
        <div className="status-pill">v0.3 / Crawler Ready UI</div>
      </header>

      <RaceSelector races={races} selectedRaceId={selectedRaceId} onSelectRace={setSelectedRaceId} />

      <section className="race-summary">
        <div>
          <p className="label">選択中レース</p>
          <h2>{selectedRace.date} {selectedRace.course} {selectedRace.raceNo} {selectedRace.raceName}</h2>
        </div>
        <div className="crawl-box">
          <strong>次STEPで自動巡回</strong>
          <span>レース名でWeb検索 → 15ソース選定 → 印抽出 → 表に反映</span>
        </div>
      </section>

      <div className="content-grid">
        <section className="main-panel">
          <PredictionTable race={selectedRace} />
        </section>
        <Insights race={selectedRace} />
      </div>
    </main>
  );
}
