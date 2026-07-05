import { getHonmeiCount, getScore, markScore, sources, type Race, type Mark } from "../lib/mock-data";

type Props = {
  race: Race;
};

function markClass(mark: Mark) {
  if (!mark) return "mark empty";
  return `mark mark-${markScore[mark]}`;
}

export function PredictionTable({ race }: Props) {
  const rankedHorses = [...race.horses].sort((a, b) => {
    const scoreA = getScore(race.predictions[a.number]);
    const scoreB = getScore(race.predictions[b.number]);
    return scoreB - scoreA;
  });

  return (
    <section className="table-card">
      <div className="table-header">
        <div>
          <p className="eyebrow">15ソース横断</p>
          <h2>予想印マトリクス</h2>
        </div>
        <p className="hint">横にスクロールできます</p>
      </div>

      <div className="table-scroll">
        <table className="prediction-table">
          <thead>
            <tr>
              <th className="sticky-col number-col">馬番</th>
              <th className="sticky-col name-col">馬名</th>
              <th>騎手</th>
              <th>人気</th>
              <th>オッズ</th>
              {sources.map((source) => (
                <th key={source.id} title={`${source.category} / 信頼度${source.reliability}`}>
                  {source.name}
                </th>
              ))}
              <th className="score-col">◎数</th>
              <th className="score-col">総合点</th>
            </tr>
          </thead>
          <tbody>
            {rankedHorses.map((horse) => {
              const row = race.predictions[horse.number];
              const honmei = getHonmeiCount(row);
              const score = getScore(row);
              return (
                <tr key={horse.number}>
                  <td className="sticky-col number-col horse-number">{horse.number}</td>
                  <td className="sticky-col name-col horse-name">{horse.name}</td>
                  <td>{horse.jockey}</td>
                  <td>{horse.popularity}人気</td>
                  <td>{horse.odds.toFixed(1)}</td>
                  {sources.map((source) => (
                    <td key={source.id}>
                      <span className={markClass(row[source.id])}>{row[source.id] || "－"}</span>
                    </td>
                  ))}
                  <td className="honmei-count">{honmei}</td>
                  <td className="total-score">{score}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
