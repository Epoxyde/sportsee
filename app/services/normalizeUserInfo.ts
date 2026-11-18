export type UserInfoResponse = {
  profile: {
    firstName: string;
    lastName: string;
    createdAt: string;
    age: number;
    weight: number;
    height: number;
    profilePicture: string;
  };
  statistics: {
    totalDistance: string;
    totalSessions: number;
    totalDuration: number;
  };
};

export function normalizeUserInfo(data: UserInfoResponse) {
  return {
    profile: { ...data.profile },
    statistics: {
      ...data.statistics,
      totalDistance: Number(data.statistics.totalDistance),
    },
  };
}
