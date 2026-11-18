import { shiftDate } from "./dates";

type WeeklyActivity = {
  date: string;
  distance: number;
  duration: number;
};

export function buildWeeklySummary(activities: readonly WeeklyActivity[], startDate: string, goal: number) {
  if (!Number.isInteger(goal) || goal <= 0) {
    throw new Error("L'objectif hebdomadaire doit être un entier positif.");
  }

  const endDate = shiftDate(startDate, 6);
  const sessions = activities.filter((activity) => activity.date >= startDate && activity.date <= endDate);
  const completed = sessions.length;

  return {
    completed,
    goal,
    remaining: Math.max(0, goal - completed),
    // Le cercle s'arrête à 100 %, mais le compteur conserve toutes les courses.
    progress: Math.min(completed, goal),
    totalDuration: sessions.reduce((total, activity) => total + activity.duration, 0),
    totalDistance: sessions.reduce((total, activity) => total + activity.distance, 0),
  };
}
