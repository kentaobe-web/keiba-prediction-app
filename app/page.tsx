"use client";

import { useMemo, useState } from "react";
import RaceSelector, { RaceSelection } from "@/components/RaceSelector";
import PredictionTable from "@/components/PredictionTable";
import InsightCards from "@/components/InsightCards";
import { HORSES, CURRENT_RACE } from "@/lib/mock-data";
import {
  computeStats,
  pickHonmei,
  pickAnauma,
  pickKiken,
} from "@/lib/analysis";

export default function Page() {
  const [selection, setSelection] = useState<RaceSelection>({
    date: CURRENT_RACE.date,
    category: CURRENT_RACE.category,
    track: CURRENT_RACE.track,
    raceName: CURRENT_RACE.raceName,
  });

  const stats = useMemo(() => computeStats(HORSES), []);
  const honmei = useMemo(() => pickHonmei(stats), [stats]);
  const anauma = useMemo(() => pickAnauma(stats), [stats]);
  const kiken = useMemo(() => pickKiken(stats), [stats]);

  return (
    <main className="page">
      <header className="site-header">
        <h1 className="site-title">予想まとめ小部ちゃん</h1>
        <p className="site-subtitle">中央・地方競馬 予想集約ダッシュボード</p>
      </header>

      <RaceSelector value={selection} onChange={setSelection} />

      <div className="race-heading">
        <span className={`badge badge-${selection.category === "中央" ? "central" : "local"}`}>
          {selection.category}
        </span>
        <span className="race-heading-text">
          {selection.date}　{selection.track}　{selection.raceName}
        </span>
      </div>

      <InsightCards honmei={honmei} anauma={anauma} kiken={kiken} />

      <PredictionTable stats={stats} honmeiUmaban={honmei?.horse.umaban} />

      <footer className="site-footer">
        ※ 表示中のデータは仮データです（外部API・スクレイピングは未実装）
      </footer>
    </main>
  );
}
