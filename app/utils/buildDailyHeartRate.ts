import { shiftDate } from "./dates";

type HeartRateActivity = {
  date: string;
  duration: number;
  heartRate: { min: number; max: number; average: number };
};

export type DailyHeartRate = {
  date: string;
  label: string;
  min: number | null;
  max: number | null;
  average: number | null;
};

// Une moyenne pondérée par la durée donne plus de poids aux séances longues.
function averageHeartRate(activities: readonly HeartRateActivity[]): number | null {
  const duration = activities.reduce((total, activity) => total + activity.duration, 0);
  if (duration <= 0) return null;
  return activities.reduce((total, activity) => total + activity.heartRate.average * activity.duration, 0) / duration;
}

export function buildDailyHeartRate(activities: readonly HeartRateActivity[], startDate: string) {
  const endDate = shiftDate(startDate, 6);
  const sessions = activities.filter((activity) => activity.date >= startDate && activity.date <= endDate);
  const weekdays = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
  const days: DailyHeartRate[] = Array.from({ length: 7 }, (_, index) => {
    const date = shiftDate(startDate, index);
    const daySessions = sessions.filter((activity) => activity.date === date);
    return {
      date,
      label: weekdays[new Date(`${date}T00:00:00Z`).getUTCDay()],
      // Sans séance, null représente une absence de mesure, pas un pouls nul.
      min: daySessions.length ? Math.min(...daySessions.map((activity) => activity.heartRate.min)) : null,
      max: daySessions.length ? Math.max(...daySessions.map((activity) => activity.heartRate.max)) : null,
      average: averageHeartRate(daySessions),
    };
  });

  return { days, averageHeartRate: averageHeartRate(sessions) };
}
