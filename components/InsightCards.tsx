import { HorseStat } from "@/lib/analysis";

interface Props {
  honmei: HorseStat | null;
  anauma: HorseStat[];
  kiken: HorseStat[];
}

function HorseLine({ stat }: { stat: HorseStat }) {
  return (
    <div className="insight-horse">
      <span className="insight-umaban">{stat.horse.umaban}</span>
      <span className="insight-name">{stat.horse.name}</span>
      <span className="insight-meta">
        {stat.horse.ninki}人気 / {stat.horse.odds.toFixed(1)}倍
      </span>
      <span className="insight-score">総合 {stat.totalScore}</span>
    </div>
  );
}

export default function InsightCards({ honmei, anauma, kiken }: Props) {
  return (
    <div className="insight-grid">
      <section className="card card-honmei">
        <h3>AI総合本命</h3>
        {honmei ? (
          <HorseLine stat={honmei} />
        ) : (
          <p className="empty">該当なし</p>
        )}
      </section>

      <section className="card card-anauma">
        <h3>穴馬候補</h3>
        <p className="card-desc">人気が低いのに総合点が高い馬</p>
        {anauma.length > 0 ? (
          anauma.map((s) => <HorseLine key={s.horse.umaban} stat={s} />)
        ) : (
          <p className="empty">該当なし</p>
        )}
      </section>

      <section className="card card-kiken">
        <h3>危険人気馬</h3>
        <p className="card-desc">人気が高いのに総合点が低い馬</p>
        {kiken.length > 0 ? (
          kiken.map((s) => <HorseLine key={s.horse.umaban} stat={s} />)
        ) : (
          <p className="empty">該当なし</p>
        )}
      </section>
    </div>
  );
}
