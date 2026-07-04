import { Horse, Prediction, PredictionSource, scoreMark } from "@/lib/mock-data";

type Props = {
  horses: Horse[];
  sources: PredictionSource[];
  predictions: Prediction[];
};

export function PredictionTable({ horses, sources, predictions }: Props) {
  const getMark = (horseId: string, sourceId: string) => {
    return predictions.find((item) => item.horseId === horseId && item.sourceId === sourceId)?.mark ?? "";
  };

  const getScore = (horseId: string) => {
    return sources.reduce((total, source) => total + scoreMark(getMark(horseId, source.id)), 0);
  };

  const getFavoriteCount = (horseId: string) => {
    return sources.filter((source) => getMark(horseId, source.id) === "◎").length;
  };

  const sortedHorses = [...horses].sort((a, b) => b.horseNumber - a.horseNumber).sort((a, b) => getScore(b.id) - getScore(a.id));

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>馬番</th>
            <th>枠</th>
            <th className="left">馬名</th>
            <th>騎手</th>
            {sources.map((source) => (
              <th key={source.id} title={source.category}>{source.name}</th>
            ))}
            <th>◎数</th>
            <th>総合点</th>
          </tr>
        </thead>
        <tbody>
          {sortedHorses.map((horse) => (
            <tr key={horse.id}>
              <td><span className="badge">{horse.horseNumber}</span></td>
              <td>{horse.frameNumber}</td>
              <td className="left">{horse.horseName}</td>
              <td>{horse.jockey}</td>
              {sources.map((source) => (
                <td className="mark" key={source.id}>{getMark(horse.id, source.id)}</td>
              ))}
              <td>{getFavoriteCount(horse.id)}</td>
              <td className="score">{getScore(horse.id)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
