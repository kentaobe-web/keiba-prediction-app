"use client";

import type { Race, RaceType } from "../lib/mock-data";

type Props = {
  races: Race[];
  selectedRaceId: string;
  onRaceChange: (raceId: string) => void;
};

export function RaceSelector({ races, selectedRaceId, onRaceChange }: Props) {
  const selectedRace = races.find((race) => race.id === selectedRaceId) ?? races[0];

  const raceTypes: { value: RaceType; label: string }[] = [
    { value: "central", label: "中央競馬" },
    { value: "local", label: "地方競馬" }
  ];

  const filteredByType = races.filter((race) => race.type === selectedRace.type);
  const courses = Array.from(new Set(filteredByType.map((race) => race.course)));
  const filteredByCourse = filteredByType.filter((race) => race.course === selectedRace.course);

  function selectFirstRaceByType(type: RaceType) {
    const nextRace = races.find((race) => race.type === type);
    if (nextRace) onRaceChange(nextRace.id);
  }

  function selectFirstRaceByCourse(course: string) {
    const nextRace = filteredByType.find((race) => race.course === course);
    if (nextRace) onRaceChange(nextRace.id);
  }

  return (
    <section className="selector-card">
      <div className="selector-grid">
        <label>
          <span>開催日</span>
          <select value={selectedRace.date} onChange={() => undefined}>
            <option value={selectedRace.date}>{selectedRace.date}</option>
          </select>
        </label>

        <label>
          <span>種別</span>
          <select value={selectedRace.type} onChange={(event) => selectFirstRaceByType(event.target.value as RaceType)}>
            {raceTypes.map((type) => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
        </label>

        <label>
          <span>競馬場</span>
          <select value={selectedRace.course} onChange={(event) => selectFirstRaceByCourse(event.target.value)}>
            {courses.map((course) => (
              <option key={course} value={course}>{course}</option>
            ))}
          </select>
        </label>

        <label>
          <span>レース</span>
          <select value={selectedRace.id} onChange={(event) => onRaceChange(event.target.value)}>
            {filteredByCourse.map((race) => (
              <option key={race.id} value={race.id}>
                {race.raceNo} {race.name}
              </option>
            ))}
          </select>
        </label>
      </div>
    </section>
  );
}
