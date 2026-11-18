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

// UTC évite les décalages liés aux changements d'heure lors des calculs de dates.
function parseDate(value: string): Date {
  const date = new Date(`${value}T00:00:00.000Z`);
  if (!Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== value) {
    throw new Error("La date doit être une date valide au format YYYY-MM-DD.");
  }
  return date;
}

function addDays(date: Date, days: number): string {
  const result = new Date(date);
  result.setUTCDate(result.getUTCDate() + days);
  return result.toISOString().slice(0, 10);
}

export function shiftDate(date: string, days: number): string {
  return addDays(parseDate(date), days);
}

// La période commence à startDate et couvre exactement 28 jours, bornes incluses.
// Le composant pourra fournir un lundi pour obtenir quatre semaines lundi–dimanche.
export function buildWeeklyDistance(activities: readonly DistanceActivity[], startDate: string) {
  const start = parseDate(startDate);
  const weeks: WeeklyDistance[] = Array.from({ length: 4 }, (_, index) => ({
    label: `S${index + 1}`,
    startDate: addDays(start, index * 7),
    endDate: addDays(start, index * 7 + 6),
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
