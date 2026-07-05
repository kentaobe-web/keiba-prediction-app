// lib/analysis.ts
import { Horse, MARK_SCORE } from "./mock-data";

export interface HorseStat {
  horse: Horse;
  honmeiCount: number; // ◎数
  totalScore: number; // 総合点
}

export function computeStats(horses: Horse[]): HorseStat[] {
  return horses.map((horse) => {
    let honmeiCount = 0;
    let totalScore = 0;
    for (const mk of horse.marks) {
      if (mk === "◎") honmeiCount += 1;
      totalScore += MARK_SCORE[mk];
    }
    return { horse, honmeiCount, totalScore };
  });
}

// AI総合本命：総合点が最も高い馬
export function pickHonmei(stats: HorseStat[]): HorseStat | null {
  if (stats.length === 0) return null;
  return [...stats].sort((a, b) => b.totalScore - a.totalScore)[0];
}

// 穴馬候補：人気が低いのに総合点が高い馬
export function pickAnauma(stats: HorseStat[]): HorseStat[] {
  const maxScore = Math.max(1, ...stats.map((s) => s.totalScore));
  return stats
    .filter((s) => s.horse.ninki >= 6 && s.totalScore >= maxScore * 0.45)
    .sort((a, b) => b.totalScore - a.totalScore)
    .slice(0, 3);
}

// 危険人気馬：人気が高いのに総合点が低い馬
export function pickKiken(stats: HorseStat[]): HorseStat[] {
  const maxScore = Math.max(1, ...stats.map((s) => s.totalScore));
  return stats
    .filter((s) => s.horse.ninki <= 4 && s.totalScore <= maxScore * 0.5)
    .sort((a, b) => a.totalScore - b.totalScore)
    .slice(0, 3);
}
