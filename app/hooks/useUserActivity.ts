import { useEffect, useState } from "react";
import { getUserActivity } from "../services/userService";

type UserActivity = Awaited<ReturnType<typeof getUserActivity>>;

// Les dates doivent utiliser le format YYYY-MM-DD.
export function useUserActivity(startDate: string, endDate: string) {
  const [activities, setActivities] = useState<UserActivity>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    async function loadActivities() {
      setLoading(true);
      setError(null);
      setActivities([]);

      if (!startDate || !endDate || startDate > endDate) {
        setLoading(false);
        return;
      }

      try {
        const data = await getUserActivity(startDate, endDate);

        if (!ignore) {
          setActivities(data);
        }
      } catch {
        if (!ignore) {
          setError("Impossible de charger les activités utilisateur.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    void loadActivities();

    return () => {
      // Ignore la réponse si la période change ou si le composant est démonté.
      ignore = true;
    };
  }, [startDate, endDate]);

  return { activities, loading, error };
}
