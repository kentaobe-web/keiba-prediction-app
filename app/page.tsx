import { RaceSelector } from "@/components/RaceSelector";
import { PredictionTable } from "@/components/PredictionTable";
import { getRaceView, races } from "@/lib/mock-data";

export default function Home({ searchParams }: { searchParams: { raceId?: string } }) {
  const raceId = searchParams.raceId ?? races[0].id;
  const { race, horses, sources, predictions } = getRaceView(raceId);

  return (
    <main className="container">
      <header className="header">
        <h1>競馬予想まとめアプリ</h1>
        <p>複数の予想元を、馬番・馬名ごとに横並びで比較するMVPです。</p>
      </header>

      <section className="card">
        <RaceSelector />
        <div className="race-info">
          {race.date} / {race.racecourse}{race.raceNumber}R / {race.raceName} / 発走 {race.startTime}
        </div>
        <PredictionTable horses={horses} sources={sources} predictions={predictions} />
        <p className="footer-note">
          現在は仮データです。次の段階でSupabase接続、CSV取込、外部API連携を追加します。
        </p>
      </section>
    </main>
  );
}
