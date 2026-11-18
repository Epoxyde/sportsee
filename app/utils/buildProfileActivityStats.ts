import { shiftDate } from "./dates";

type Activity = { date: string; caloriesBurned: number };

export function buildProfileActivityStats(activities: readonly Activity[], startDate: string, endDate: string) {
  // Valider les dates avant le calcul en jours calendaires (sans décalage horaire).
  const start = Date.parse(`${shiftDate(startDate, 0)}T00:00:00Z`);
  const end = Date.parse(`${shiftDate(endDate, 0)}T00:00:00Z`);
  const totalDays = Math.max(0, Math.round((end - start) / 86400000) + 1);
  const sessions = activities.filter((activity) => activity.date >= startDate && activity.date <= endDate);
  const activeDays = new Set(sessions.map((activity) => activity.date)).size;

  return {
    calories: sessions.reduce((sum, activity) => sum + activity.caloriesBurned, 0),
    // Plusieurs courses le même jour ne retirent qu'un seul jour de repos.
    restDays: Math.max(0, totalDays - activeDays),
  };
}
