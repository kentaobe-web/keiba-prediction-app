"use client";

import type { PredictionRow, PredictionSource } from "../lib/types";

export function PredictionTable({ rows, sources }: { rows: PredictionRow[]; sources: PredictionSource[] }) {
  const sortedRows = [...rows].sort((a, b) => b.score - a.score || b.winCount - a.winCount || a.number - b.number);

  return (
    <section className="table-card">
      <div className="table-header">
        <div>
          <h2>予想一覧</h2>
          <p>縦軸は馬番・馬名、横軸は15人分の予想です。</p>
        </div>
        <div className="legend">
          <span className="mark win">◎</span><span>本命</span>
          <span className="mark second">○</span><span>対抗</span>
          <span className="mark third">▲</span><span>単穴</span>
          <span className="mark keep">△</span><span>連下</span>
          <span className="mark star">☆</span><span>穴</span>
        </div>
      </div>

      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th className="sticky-col num-col">馬番</th>
              <th className="sticky-col name-col">馬名</th>
              <th>騎手</th>
              {sources.map((source) => <th key={source.id}>{source.name}</th>)}
              <th>◎数</th>
              <th>総合点</th>
            </tr>
          </thead>
          <tbody>
            {sortedRows.map((row) => (
              <tr key={row.number}>
                <td className="sticky-col num-col horse-number">{row.number}</td>
                <td className="sticky-col name-col horse-name">{row.name}</td>
                <td>{row.jockey}</td>
                {sources.map((source) => {
                  const mark = row.marks[source.id] ?? "";
                  return <td key={source.id}><span className={`mark ${markClass(mark)}`}>{mark || "-"}</span></td>;
                })}
                <td className="win-count">{row.winCount}</td>
                <td className="score">{row.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function markClass(mark: string) {
  if (mark === "◎") return "win";
  if (mark === "○") return "second";
  if (mark === "▲") return "third";
  if (mark === "△") return "keep";
  if (mark === "☆") return "star";
  return "none";
}
