"use client";

import { Race } from "@/lib/mock-data";

type Props = {
  races: Race[];
  selectedRaceId: string;
  onChange: (raceId: string) => void;
};

export function RaceSelector({ races, selectedRaceId, onChange }: Props) {
  const selected = races.find((race) => race.id === selectedRaceId) ?? races[0];
  const dates = Array.from(new Set(races.map((race) => race.date)));
  const categories = Array.from(new Set(races.map((race) => race.category)));
  const courses = Array.from(new Set(races.filter((race) => race.category === selected.category).map((race) => race.course)));

  function selectFirst(filter: Partial<Pick<Race, "date" | "category" | "course">>) {
    const next = races.find((race) =>
      (!filter.date || race.date === filter.date) &&
      (!filter.category || race.category === filter.category) &&
      (!filter.course || race.course === filter.course)
    );
    if (next) onChange(next.id);
  }

  return (
    <section className="selector-card">
      <div className="select-grid">
        <label>
          <span>開催日</span>
          <select value={selected.date} onChange={(e) => selectFirst({ date: e.target.value })}>
            {dates.map((date) => <option key={date}>{date}</option>)}
          </select>
        </label>
        <label>
          <span>種別</span>
          <select value={selected.category} onChange={(e) => selectFirst({ category: e.target.value as Race["category"] })}>
            {categories.map((category) => <option key={category}>{category}</option>)}
          </select>
        </label>
        <label>
          <span>競馬場</span>
          <select value={selected.course} onChange={(e) => selectFirst({ category: selected.category, course: e.target.value })}>
            {courses.map((course) => <option key={course}>{course}</option>)}
          </select>
        </label>
        <label>
          <span>レース</span>
          <select value={selectedRaceId} onChange={(e) => onChange(e.target.value)}>
            {races
              .filter((race) => race.date === selected.date && race.category === selected.category && race.course === selected.course)
              .map((race) => <option key={race.id} value={race.id}>{race.raceName}</option>)}
          </select>
        </label>
      </div>
      <p className="race-meta">{selected.course} / {selected.raceName} / 発走 {selected.startTime}</p>
    </section>
  );
}
