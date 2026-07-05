"use client";

import { useMemo, useState } from "react";
import { PredictionTable } from "@/components/PredictionTable";
import { RaceSelector } from "@/components/RaceSelector";
import { races } from "@/lib/mock-data";

const sampleUrls = [
  "https://example.com/tospo-race",
  "https://example.com/ai-prediction",
  "https://example.com/note-prediction",
];

export default function Home() {
  const [selectedRaceId, setSelectedRaceId] = useState(races[0].id);
  const selectedRace = useMemo(() => races.find((race) => race.id === selectedRaceId) ?? races[0], [selectedRaceId]);

  return (
    <main className="page">
      <header className="hero">
        <p className="eyebrow">個人利用MVP</p>
        <h1>競馬予想まとめダッシュボード</h1>
        <p className="lead">中央競馬・地方競馬の予想15列を、馬番ごとに横並びで確認するための試作版です。</p>
      </header>

      <RaceSelector races={races} selectedRaceId={selectedRaceId} onChange={setSelectedRaceId} />

      <section className="url-card">
        <div>
          <h2>予想URL登録欄</h2>
          <p>次のステップで、ここに新聞・AI・noteなどのURLを貼ってAI抽出できるようにします。今は見た目だけです。</p>
        </div>
        <div className="url-list">
          {sampleUrls.map((url, index) => <input key={url} value={url} readOnly aria-label={`予想URL${index + 1}`} />)}
        </div>
      </section>

      <section className="dashboard-card">
        <div className="section-title">
          <div>
            <h2>{selectedRace.raceName}</h2>
            <p>{selectedRace.category} / {selectedRace.course} / {selectedRace.date}</p>
          </div>
          <span className="badge">予想元 15件</span>
        </div>
        <PredictionTable race={selectedRace} />
      </section>
    </main>
  );
}
