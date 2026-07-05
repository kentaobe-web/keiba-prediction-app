import { SOURCES } from "@/lib/mock-data";
import { HorseStat } from "@/lib/analysis";

interface Props {
  stats: HorseStat[];
  honmeiUmaban?: number;
}

function markClass(mark: string): string {
  switch (mark) {
    case "◎":
      return "mark mark-honmei";
    case "○":
      return "mark mark-taikou";
    case "▲":
      return "mark mark-tanana";
    case "△":
      return "mark mark-renka";
    case "☆":
      return "mark mark-hoshi";
    default:
      return "mark mark-none";
  }
}

export default function PredictionTable({ stats, honmeiUmaban }: Props) {
  return (
    <div className="table-scroll">
      <table className="prediction-table">
        <thead>
          <tr>
            <th className="col-sticky col-umaban">馬番</th>
            <th className="col-sticky col-name">馬名</th>
            <th>騎手</th>
            <th>人気</th>
            <th>オッズ</th>
            {SOURCES.map((s) => (
              <th key={s} className="col-source">
                {s}
              </th>
            ))}
            <th className="col-agg">◎数</th>
            <th className="col-agg">総合点</th>
          </tr>
        </thead>
        <tbody>
          {stats.map(({ horse, honmeiCount, totalScore }) => {
            const isHonmei = horse.umaban === honmeiUmaban;
            return (
              <tr key={horse.umaban} className={isHonmei ? "row-honmei" : ""}>
                <td className="col-sticky col-umaban">
                  <span className={`umaban waku-${horse.umaban}`}>
                    {horse.umaban}
                  </span>
                </td>
                <td className="col-sticky col-name">{horse.name}</td>
                <td>{horse.jockey}</td>
                <td>{horse.ninki}</td>
                <td>{horse.odds.toFixed(1)}</td>
                {horse.marks.map((mk, i) => (
                  <td key={i}>
                    <span className={markClass(mk)}>{mk || "―"}</span>
                  </td>
                ))}
                <td className="col-agg strong">{honmeiCount}</td>
                <td className="col-agg strong">{totalScore}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
