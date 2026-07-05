"use client";

export interface SourceStatus {
  source: string;
  url: string;
  status: "ok" | "取得不可" | "印検出なし";
  reason?: string;
  markCount: number;
}

interface Props {
  statuses: SourceStatus[];
}

function statusClass(s: SourceStatus["status"]): string {
  switch (s) {
    case "ok":
      return "st-ok";
    case "取得不可":
      return "st-fail";
    case "印検出なし":
      return "st-empty";
  }
}

function statusLabel(s: SourceStatus): string {
  if (s.status === "ok") return `反映 (${s.markCount})`;
  if (s.status === "印検出なし") return "印検出なし";
  return s.reason ? `取得不可: ${s.reason}` : "取得不可";
}

export default function ResearchStatus({ statuses }: Props) {
  if (statuses.length === 0) return null;
  return (
    <div className="research-status">
      <h3 className="research-status-title">取得結果</h3>
      <div className="research-status-list">
        {statuses.map((s) => (
          <div key={s.source + s.url} className="research-status-item">
            <span className="rs-source">{s.source}</span>
            <span className={`rs-badge ${statusClass(s.status)}`}>
              {statusLabel(s)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
