import { markScore, Race, sources } from "@/lib/mock-data";

type Props = {
  race: Race;
};

export function PredictionTable({ race }: Props) {
  return (
    <div className="table-wrap">
      <table className="prediction-table">
        <thead>
          <tr>
            <th className="sticky-col number-col">馬番</th>
            <th className="sticky-col name-col">馬名</th>
            <th>騎手</th>
            {sources.map((source) => <th key={source.id}>{source.name}</th>)}
            <th>◎数</th>
            <th>総合点</th>
          </tr>
        </thead>
        <tbody>
          {race.horses.map((horse) => {
            const prediction = race.predictions[horse.number] ?? {};
            const honmeiCount = sources.filter((source) => prediction[source.id] === "◎").length;
            const totalScore = sources.reduce((sum, source) => sum + markScore[prediction[source.id] ?? ""], 0);
            return (
              <tr key={horse.number}>
                <td className="sticky-col number-col horse-number">{horse.number}</td>
                <td className="sticky-col name-col horse-name">{horse.name}</td>
                <td>{horse.jockey}</td>
                {sources.map((source) => {
                  const mark = prediction[source.id] ?? "";
                  return <td key={source.id} className={`mark mark-${mark || "none"}`}>{mark || "-"}</td>;
                })}
                <td className="count-cell">{honmeiCount}</td>
                <td className="score-cell">{totalScore}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
