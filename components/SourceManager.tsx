"use client";

import { useRef, useState } from "react";
import { SOURCES } from "@/lib/mock-data";
import { ResearchSource, newSourceId } from "@/lib/research-sources";

interface Props {
  sources: ResearchSource[];
  onChange: (next: ResearchSource[]) => void;
}

function toCsv(sources: ResearchSource[]): string {
  const header = "source,urlTemplate,enabled";
  const rows = sources.map((s) => {
    const url = `"${s.urlTemplate.replaceAll('"', '""')}"`;
    return `${s.source},${url},${s.enabled ? "1" : "0"}`;
  });
  return [header, ...rows].join("\n");
}

// 簡易CSVパーサ（ダブルクオート対応）
function parseCsv(text: string): ResearchSource[] {
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length === 0) return [];
  const out: ResearchSource[] = [];
  const start = /^source\s*,/i.test(lines[0]) ? 1 : 0;
  for (let i = start; i < lines.length; i++) {
    const cols = splitCsvLine(lines[i]);
    if (cols.length < 2) continue;
    const source = cols[0].trim();
    const urlTemplate = cols[1].trim();
    const enabled = cols[2] ? /^(1|true|yes)$/i.test(cols[2].trim()) : true;
    if (!urlTemplate) continue;
    out.push({ id: newSourceId(), source, urlTemplate, enabled });
  }
  return out;
}

function splitCsvLine(line: string): string[] {
  const result: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (inQuotes) {
      if (c === '"' && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else if (c === '"') {
        inQuotes = false;
      } else {
        cur += c;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ",") {
      result.push(cur);
      cur = "";
    } else {
      cur += c;
    }
  }
  result.push(cur);
  return result;
}

export default function SourceManager({ sources, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function update(id: string, patch: Partial<ResearchSource>) {
    onChange(sources.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  }
  function remove(id: string) {
    onChange(sources.filter((s) => s.id !== id));
  }
  function add() {
    onChange([
      ...sources,
      {
        id: newSourceId(),
        source: SOURCES[0],
        urlTemplate: "",
        enabled: true,
      },
    ]);
  }

  function exportCsv() {
    const blob = new Blob([toCsv(sources)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "kobu-chan-source-urls.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  function importCsv(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      const parsed = parseCsv(String(reader.result || ""));
      if (parsed.length > 0) onChange([...sources, ...parsed]);
    };
    reader.readAsText(file);
  }

  return (
    <section className="source-manager">
      <div className="sm-head">
        <button className="sm-toggle" onClick={() => setOpen((o) => !o)}>
          URL設定 {open ? "▲" : "▼"}（{sources.length}件）
        </button>
      </div>

      {open && (
        <div className="sm-body">
          <p className="sm-warn">
            ⚠️ 規約・robots.txt で自動取得が許可されたURLのみ登録してください。
            ログイン必須・有料記事は登録しないでください。URL内の {"{track}"}{" "}
            {"{raceNo}"} {"{raceName}"} は選択中レースの値に置換されます。
          </p>

          <div className="sm-list">
            {sources.length === 0 && (
              <p className="empty">まだ登録がありません。</p>
            )}
            {sources.map((s) => (
              <div key={s.id} className="sm-row">
                <label className="sm-enable">
                  <input
                    type="checkbox"
                    checked={s.enabled}
                    onChange={(e) => update(s.id, { enabled: e.target.checked })}
                  />
                </label>
                <select
                  className="sm-source"
                  value={s.source}
                  onChange={(e) => update(s.id, { source: e.target.value })}
                >
                  {SOURCES.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
                <input
                  className="sm-url"
                  type="text"
                  placeholder="https://example.com/{track}/{raceNo}"
                  value={s.urlTemplate}
                  onChange={(e) =>
                    update(s.id, { urlTemplate: e.target.value })
                  }
                />
                <button className="sm-del" onClick={() => remove(s.id)}>
                  削除
                </button>
              </div>
            ))}
          </div>

          <div className="sm-actions">
            <button className="sm-btn" onClick={add}>
              ＋ URLを追加
            </button>
            <button className="sm-btn" onClick={exportCsv}>
              CSVエクスポート
            </button>
            <button
              className="sm-btn"
              onClick={() => fileRef.current?.click()}
            >
              CSVインポート
            </button>
            <input
              ref={fileRef}
              type="file"
              accept=".csv,text/csv"
              style={{ display: "none" }}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) importCsv(f);
                e.target.value = "";
              }}
            />
          </div>
        </div>
      )}
    </section>
  );
}
