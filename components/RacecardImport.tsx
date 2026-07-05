"use client";

import { useState } from "react";
import { parseRacecard, toHorses, ParsedHorse } from "@/lib/parse-racecard";
import { Horse } from "@/lib/mock-data";

interface Props {
  onApply: (horses: Horse[]) => void;
}

export default function RacecardImport({ onApply }: Props) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [preview, setPreview] = useState<ParsedHorse[]>([]);
  const [skipped, setSkipped] = useState(0);
  const [note, setNote] = useState<string | null>(null);

  function handleParse() {
    const result = parseRacecard(text);
    setPreview(result.horses);
    setSkipped(result.skipped);
    setNote(result.note ?? null);
  }

  function handleApply() {
    if (preview.length === 0) return;
    onApply(toHorses(preview));
    setOpen(false);
  }

  return (
    <section className="racecard-import">
      <div className="ri-head">
        <button className="ri-toggle" onClick={() => setOpen((o) => !o)}>
          出馬表を貼り付けて取り込む {open ? "▲" : "▼"}
        </button>
      </div>

      {open && (
        <div className="ri-body">
          <p className="ri-help">
            出馬表ページで、馬番・馬名・騎手・人気・オッズが並んだ表の部分を選択して
            コピーし、下の欄に貼り付けて「解析」を押してください。タブ区切り・スペース
            区切りどちらでも解析します。取り込み後、各予想元の印は空になります。
          </p>

          <textarea
            className="ri-textarea"
            placeholder={
              "例（列はタブ/スペース区切り）:\n1\tサンライズホープ\t武豊\t1\t2.4\n2\tミッドナイトラン\tルメール\t2\t3.8"
            }
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={8}
          />

          <div className="ri-actions">
            <button className="ri-btn primary" onClick={handleParse}>
              解析
            </button>
            <button
              className="ri-btn"
              onClick={() => {
                setText("");
                setPreview([]);
                setNote(null);
                setSkipped(0);
              }}
            >
              クリア
            </button>
          </div>

          {note && <p className="ri-note">{note}</p>}

          {preview.length > 0 && (
            <div className="ri-preview">
              <div className="ri-preview-head">
                プレビュー（{preview.length}頭
                {skipped > 0 ? ` / 解析できなかった行: ${skipped}` : ""}）
              </div>
              <div className="ri-table-wrap">
                <table className="ri-table">
                  <thead>
                    <tr>
                      <th>馬番</th>
                      <th>馬名</th>
                      <th>騎手</th>
                      <th>人気</th>
                      <th>オッズ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {preview.map((h) => (
                      <tr key={h.umaban}>
                        <td>{h.umaban}</td>
                        <td className="ri-name">{h.name}</td>
                        <td>{h.jockey || "―"}</td>
                        <td>{h.ninki || "―"}</td>
                        <td>{h.odds ? h.odds.toFixed(1) : "―"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button className="ri-btn primary ri-apply" onClick={handleApply}>
                この出馬表を反映する
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
