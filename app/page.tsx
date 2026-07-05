import { RaceSelector } from "@/components/RaceSelector";
import { PredictionTable } from "@/components/PredictionTable";
import { getRaceView, races } from "@/lib/mock-data";

type PageProps = {
  searchParams: { raceId?: string };
};

export default function Home({ searchParams }: PageProps) {
  const raceId = searchParams.raceId ?? races[0].id;
  const { race, horses, sources, predictions } = getRaceView(raceId);

  return (
    <main className="container">
      <header className="header">
        <h1>競馬予想まとめアプリ</h1>
        <p>複数の予想元を、馬番・馬名ごとに横並びで比較します。</p>
      </header>

      <section className="card">
        <RaceSelector selectedRaceId={raceId} />
        <div className="race-info">
          {race.date} / {race.racecourse}{race.raceNumber}R / {race.raceName} / 発走 {race.startTime}
        </div>
        <PredictionTable horses={horses} sources={sources} predictions={predictions} />
        <p className="footer-note">表示データは仮データです。</p>
      </section>
    </main>
  );
}
