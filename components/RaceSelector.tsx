"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { races } from "@/lib/mock-data";

export function RaceSelector() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedRaceId = searchParams.get("raceId") ?? races[0].id;

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
