"use client";

import { RACE_DATES, TRACKS, getRaceList } from "@/lib/mock-data";
import { buildSearchKeywords } from "@/lib/research-sources";

export interface RaceSelection {
  date: string;
  category: "中央" | "地方";
  track: string;
  raceNo: string;
  raceName: string;
}

interface Props {
  value: RaceSelection;
  onChange: (next: RaceSelection) => void;
  onResearch: () => void;
  loading: boolean;
}

export default function RaceSelector({
  value,
  onChange,
  onResearch,
  loading,
}: Props) {
  const tracks = TRACKS[value.category];
  const races = getRaceList(value.date, value.track);

  const track = value.track.replace(/競馬場$/, "");
  const keywords = buildSearchKeywords({
    track,
    raceNo: value.raceNo,
    raceName: value.raceName,
  });

  return (
    <div className="selector-wrap">
      <div className="selector">
        <div className="selector-field">
          <label>開催日</label>
          <select
            value={value.date}
            onChange={(e) => {
              const date = e.target.value;
              const list = getRaceList(date, value.track);
              onChange({
                ...value,
                date,
                raceNo: list[0].raceNo,
                raceName: list[0].raceName,
              });
            }}
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
              const newTrack = TRACKS[category][0];
              const list = getRaceList(value.date, newTrack);
              onChange({
                ...value,
                category,
                track: newTrack,
                raceNo: list[0].raceNo,
                raceName: list[0].raceName,
              });
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
            onChange={(e) => {
              const t = e.target.value;
              const list = getRaceList(value.date, t);
              onChange({
                ...value,
                track: t,
                raceNo: list[0].raceNo,
                raceName: list[0].raceName,
              });
            }}
          >
            {tracks.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div className="selector-field">
          <label>レース</label>
          <select
            value={value.raceNo}
            onChange={(e) => {
              const raceNo = e.target.value;
              const found = races.find((r) => r.raceNo === raceNo);
              onChange({
                ...value,
                raceNo,
                raceName: found ? found.raceName : value.raceName,
              });
            }}
          >
            {races.map((r) => (
              <option key={r.raceNo} value={r.raceNo}>
                {r.raceNo} {r.raceName}
              </option>
            ))}
          </select>
        </div>

        <div className="selector-field selector-action">
          <label>&nbsp;</label>
          <button
            className="research-btn"
            onClick={onResearch}
            disabled={loading}
          >
            {loading ? "取得中…" : "予想を探す"}
          </button>
        </div>
      </div>

      <div className="keyword-hints">
        <span className="keyword-hints-label">検索候補：</span>
        {keywords.map((k) => (
          <span key={k} className="keyword-chip">
            {k}
          </span>
        ))}
      </div>
    </div>
  );
}
