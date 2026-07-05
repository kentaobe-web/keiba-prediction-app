import { Race, consensusForHorse, sources } from '@/lib/mock-data';

export default function Insights({ race }: { race: Race }) {
  const ranked = race.horses
    .map((horse) => ({ horse, consensus: consensusForHorse(race, horse) }))
    .sort((a, b) => b.consensus.totalScore - a.consensus.totalScore);
  const top = ranked[0];
  const value = ranked.find((item) => item.horse.popularity >= 5) ?? ranked[1];
  const danger = ranked.find((item) => item.horse.popularity <= 2 && item.consensus.totalScore < 22);
  const recommendedSources = [...sources].sort((a, b) => b.reliability - a.reliability).slice(0, 5);

  return (
    <aside className="insights">
      <div className="insight-card primary">
        <p className="label">AI総合本命</p>
        <h3>{top.horse.number} {top.horse.name}</h3>
        <p>総合点 {top.consensus.totalScore} / ◎ {top.consensus.honmeiCount}件</p>
      </div>
      <div className="insight-card">
        <p className="label">穴馬候補</p>
        <h3>{value.horse.number} {value.horse.name}</h3>
        <p>{value.horse.popularity}人気・オッズ {value.horse.odds.toFixed(1)}倍</p>
      </div>
      <div className="insight-card">
        <p className="label">危険人気馬</p>
        <h3>{danger ? `${danger.horse.number} ${danger.horse.name}` : '該当なし'}</h3>
        <p>{danger ? `人気先行。総合点 ${danger.consensus.totalScore}` : '現時点では大きな危険人気なし'}</p>
      </div>
      <div className="insight-card">
        <p className="label">今日見るべき予想元</p>
        <ol>
          {recommendedSources.map((source) => <li key={source.id}>{source.name} <span>★{source.reliability}</span></li>)}
        </ol>
      </div>
    </aside>
  );
}
