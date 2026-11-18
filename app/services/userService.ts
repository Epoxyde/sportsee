import { api } from "./api";
import { normalizeUserInfo, type UserInfoResponse } from "./normalizeUserInfo";

type UserActivityResponse = {
  date: string;
  distance: number;
  duration: number;
  heartRate: { min: number; max: number; average: number };
  caloriesBurned: number;
};

export async function getUserInfo() {
  const { data } = await api.get<UserInfoResponse>("/user-info");
  return normalizeUserInfo(data);
}

// Les deux bornes sont incluses et doivent utiliser le format YYYY-MM-DD.
export async function getUserActivity(startDate: string, endDate: string) {
  const { data } = await api.get<UserActivityResponse[]>("/user-activity", {
    params: { startWeek: startDate, endWeek: endDate },
  });

  return [...data]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((session) => ({
      ...session,
      heartRate: { ...session.heartRate },
    }));
}
