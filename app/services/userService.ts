import userInfoMock from "../mocks/userInfo.json";
import userActivityMock from "../mocks/userActivity.json";
import { normalizeUserInfo } from "./normalizeUserInfo";

export async function getUserInfo() {
  return normalizeUserInfo(userInfoMock);
}

// Les deux bornes sont incluses et doivent utiliser le format YYYY-MM-DD.
export async function getUserActivity(startDate: string, endDate: string) {
  return userActivityMock
    .filter((session) => session.date >= startDate && session.date <= endDate)
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((session) => ({
      ...session,
      heartRate: { ...session.heartRate },
    }));
}
