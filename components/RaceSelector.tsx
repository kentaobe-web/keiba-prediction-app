'use client';

import { Race } from '@/lib/mock-data';

type Props = {
  races: Race[];
  selectedRaceId: string;
  onSelectRace: (raceId: string) => void;
};

export default function RaceSelector({ races, selectedRaceId, onSelectRace }: Props) {
  const selectedRace = races.find((race) => race.id === selectedRaceId) ?? races[0];
  const categories = Array.from(new Set(races.map((race) => race.category)));
  const dates = Array.from(new Set(races.map((race) => race.date)));
  const courses = Array.from(new Set(races.filter((race) => race.category === selectedRace.category).map((race) => race.course)));

  return (
    <section className="selector-card">
      <div className="field">
        <label>開催日</label>
        <select value={selectedRace.date} onChange={(event) => {
          const next = races.find((race) => race.date === event.target.value) ?? selectedRace;
          onSelectRace(next.id);
        }}>
          {dates.map((date) => <option key={date}>{date}</option>)}
        </select>
      </div>
      <div className="field">
        <label>種別</label>
        <select value={selectedRace.category} onChange={(event) => {
          const next = races.find((race) => race.category === event.target.value) ?? selectedRace;
          onSelectRace(next.id);
        }}>
          {categories.map((category) => <option key={category}>{category}</option>)}
        </select>
      </div>
      <div className="field">
        <label>競馬場</label>
        <select value={selectedRace.course} onChange={(event) => {
          const next = races.find((race) => race.category === selectedRace.category && race.course === event.target.value) ?? selectedRace;
          onSelectRace(next.id);
        }}>
          {courses.map((course) => <option key={course}>{course}</option>)}
        </select>
      </div>
      <div className="field wide">
        <label>レース</label>
        <select value={selectedRace.id} onChange={(event) => onSelectRace(event.target.value)}>
          {races.filter((race) => race.category === selectedRace.category && race.course === selectedRace.course).map((race) => (
            <option key={race.id} value={race.id}>{race.raceNo} {race.raceName}</option>
          ))}
        </select>
      </div>
      <button className="fetch-button" type="button">AIリサーチ開始</button>
    </section>
  );
}
