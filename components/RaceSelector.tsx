"use client";

import { RACE_DATES, TRACKS } from "@/lib/mock-data";

export interface RaceSelection {
  date: string;
  category: "中央" | "地方";
  track: string;
  raceName: string;
}

interface Props {
  value: RaceSelection;
  onChange: (next: RaceSelection) => void;
}

const RACE_NAMES = [
  "11R メインステークス (G3)",
  "10R 特別戦",
  "9R 3歳上1勝クラス",
  "12R 最終レース",
];

export default function RaceSelector({ value, onChange }: Props) {
  const tracks = TRACKS[value.category];

  return (
    <div className="selector">
      <div className="selector-field">
        <label>開催日</label>
        <select
          value={value.date}
          onChange={(e) => onChange({ ...value, date: e.target.value })}
        >
          {RACE_DATES.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      <div className="selector-field">
        <label>中央 / 地方</label>
        <select
          value={value.category}
          onChange={(e) => {
            const category = e.target.value as "中央" | "地方";
            onChange({ ...value, category, track: TRACKS[category][0] });
          }}
        >
          <option value="中央">中央</option>
          <option value="地方">地方</option>
        </select>
      </div>

      <div className="selector-field">
        <label>競馬場</label>
        <select
          value={value.track}
          onChange={(e) => onChange({ ...value, track: e.target.value })}
        >
          {tracks.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div className="selector-field">
        <label>レース名</label>
        <select
          value={value.raceName}
          onChange={(e) => onChange({ ...value, raceName: e.target.value })}
        >
          {RACE_NAMES.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
