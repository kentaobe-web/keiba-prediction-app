import { Race, consensusForHorse, sources } from '@/lib/mock-data';

export default function PredictionTable({ race }: { race: Race }) {
  const rows = race.horses
    .map((horse) => ({ horse, consensus: consensusForHorse(race, horse) }))
    .sort((a, b) => b.consensus.totalScore - a.consensus.totalScore);

  return (
    <div className="table-wrap">
      <table className="prediction-table">
        <thead>
          <tr>
            <th className="sticky-col">馬番</th>
            <th className="horse-col">馬名</th>
            <th>騎手</th>
            <th>人気</th>
            <th>オッズ</th>
            {sources.map((source) => <th key={source.id}>{source.name}</th>)}
            <th>◎数</th>
            <th>総合点</th>
            <th>判定</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ horse, consensus }) => {
            const isValue = horse.popularity >= 5 && consensus.totalScore >= 24;
            const isDanger = horse.popularity <= 2 && consensus.totalScore <= 18;
            return (
              <tr key={horse.number} className={isValue ? 'value-row' : isDanger ? 'danger-row' : ''}>
                <td className="sticky-col number-cell">{horse.number}</td>
                <td className="horse-name">{horse.name}</td>
                <td>{horse.jockey}</td>
                <td>{horse.popularity}人気</td>
                <td>{horse.odds.toFixed(1)}</td>
                {consensus.sourceMarks.map((item) => (
                  <td key={item.source.id} className={`mark mark-${item.mark || 'none'}`}>{item.mark || '-'}</td>
                ))}
                <td className="score-main">{consensus.honmeiCount}</td>
                <td className="score-main">{consensus.totalScore}</td>
                <td>{isValue ? '🔥穴候補' : isDanger ? '⚠危険人気' : '通常'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
