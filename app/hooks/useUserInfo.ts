import { useEffect, useState } from "react";
import { getUserInfo } from "../services/userService";

type UserInfo = Awaited<ReturnType<typeof getUserInfo>>;

export function useUserInfo() {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    async function loadUser() {
      try {
        const data = await getUserInfo();

        if (!ignore) {
          setUser(data);
        }
      } catch {
        if (!ignore) {
          setError("Impossible de charger les informations utilisateur.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    void loadUser();

    return () => {
      // Ignore une réponse arrivée après le nettoyage de cet effet.
      ignore = true;
    };
  }, []);

  return { user, loading, error };
}
