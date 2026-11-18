import { api } from "./api";
import { normalizeUserInfo, type UserInfoResponse } from "./normalizeUserInfo";
import mockUserInfo from "../mocks/userInfo.json";
import mockUserActivity from "../mocks/userActivity.json";
import { getLocalDate } from "../utils/dates";

const dataSource = import.meta.env.VITE_DATA_SOURCE ?? "api";

if (dataSource !== "api" && dataSource !== "mock") {
  throw new Error("VITE_DATA_SOURCE doit valoir api ou mock.");
}

type UserActivityResponse = {
  date: string;
  distance: number;
  duration: number;
  heartRate: { min: number; max: number; average: number };
  caloriesBurned: number;
};

export async function getUserInfo() {
  if (dataSource === "mock") {
    return normalizeUserInfo(mockUserInfo);
  }

  const { data } = await api.get<UserInfoResponse>("/user-info");
  return normalizeUserInfo(data);
}

// Les deux bornes sont incluses et doivent utiliser le format YYYY-MM-DD.
export async function getUserActivity(startDate: string, endDate: string) {
  let data: UserActivityResponse[];

  if (dataSource === "mock") {
    const today = getLocalDate();
    // Comme l'API, conserver les bornes incluses et exclure les séances futures.
    data = mockUserActivity.filter(
      ({ date }) => date >= startDate && date <= endDate && date <= today,
    );
  } else {
    const response = await api.get<UserActivityResponse[]>("/user-activity", {
      params: { startWeek: startDate, endWeek: endDate },
    });
    data = response.data;
  }

  return [...data]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((session) => ({
      ...session,
      heartRate: { ...session.heartRate },
    }));
}
