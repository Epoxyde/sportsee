import { shiftDate } from "./dates";

type DistanceActivity = {
  date: string;
  distance: number;
};

export type WeeklyDistance = {
  label: string;
  startDate: string;
  endDate: string;
  distance: number;
};

// La période commence à startDate et couvre exactement 28 jours, bornes incluses.
// Le composant pourra fournir un lundi pour obtenir quatre semaines lundi–dimanche.
export function buildWeeklyDistance(activities: readonly DistanceActivity[], startDate: string) {
  const weeks: WeeklyDistance[] = Array.from({ length: 4 }, (_, index) => ({
    label: `S${index + 1}`,
    startDate: shiftDate(startDate, index * 7),
    endDate: shiftDate(startDate, index * 7 + 6),
    distance: 0,
  }));

  for (const activity of activities) {
    const week = weeks.find((week) => activity.date >= week.startDate && activity.date <= week.endDate);
    if (week) week.distance += activity.distance;
  }

  const totalDistance = weeks.reduce((total, week) => total + week.distance, 0);

  return {
    weeks,
    totalDistance,
    // Les semaines sans séance comptent aussi dans la moyenne.
    averageDistance: totalDistance / weeks.length,
    startDate: weeks[0].startDate,
    endDate: weeks[3].endDate,
  };
}
