"use client";

import { useRouter } from "next/navigation";
import { races } from "@/lib/mock-data";

type Props = {
  selectedRaceId: string;
};

export function RaceSelector({ selectedRaceId }: Props) {
  const router = useRouter();

  return (
    <div className="controls">
      <div>
        <label htmlFor="race-select">レースを選択</label>
        <select
          id="race-select"
          value={selectedRaceId}
          onChange={(event) => router.push(`/?raceId=${event.target.value}`)}
        >
          {races.map((race) => (
            <option key={race.id} value={race.id}>
              {race.date} {race.racecourse}{race.raceNumber}R {race.raceName}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
