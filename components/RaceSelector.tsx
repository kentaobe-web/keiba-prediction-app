"use client";

import type { Race } from "../lib/types";

type Props = {
  races: Race[];
  selectedRaceId: string;
  onChangeRace: (raceId: string) => void;
};

export function RaceSelector({ races, selectedRaceId, onChangeRace }: Props) {
  const selectedRace = races.find((race) => race.id === selectedRaceId) ?? races[0];
  const categories = Array.from(new Set(races.map((race) => race.category)));
  const courses = Array.from(new Set(races.filter((race) => race.category === selectedRace.category).map((race) => race.course)));
  const raceOptions = races.filter((race) => race.category === selectedRace.category && race.course === selectedRace.course);

  function changeCategory(category: string) {
    const nextRace = races.find((race) => race.category === category) ?? races[0];
    onChangeRace(nextRace.id);
  }

  function changeCourse(course: string) {
    const nextRace = races.find((race) => race.category === selectedRace.category && race.course === course) ?? selectedRace;
    onChangeRace(nextRace.id);
  }

  return (
    <section className="selector-card">
      <div className="selector-grid">
        <label>
          <span>開催日</span>
          <select value={selectedRace.date} onChange={(event) => {
            const nextRace = races.find((race) => race.date === event.target.value) ?? selectedRace;
            onChangeRace(nextRace.id);
          }}>
            {Array.from(new Set(races.map((race) => race.date))).map((date) => (
              <option key={date} value={date}>{date}</option>
            ))}
          </select>
        </label>
        <label>
          <span>種別</span>
          <select value={selectedRace.category} onChange={(event) => changeCategory(event.target.value)}>
            {categories.map((category) => <option key={category}>{category}</option>)}
          </select>
        </label>
        <label>
          <span>競馬場</span>
          <select value={selectedRace.course} onChange={(event) => changeCourse(event.target.value)}>
            {courses.map((course) => <option key={course}>{course}</option>)}
          </select>
        </label>
        <label>
          <span>レース</span>
          <select value={selectedRace.id} onChange={(event) => onChangeRace(event.target.value)}>
            {raceOptions.map((race) => (
              <option key={race.id} value={race.id}>{race.raceName}</option>
            ))}
          </select>
        </label>
      </div>
      <div className="race-summary">
        <strong>{selectedRace.course} {selectedRace.raceName}</strong>
        <span>発走 {selectedRace.startTime}</span>
        <span>{selectedRace.horses.length}頭立て</span>
      </div>
    </section>
  );
}
