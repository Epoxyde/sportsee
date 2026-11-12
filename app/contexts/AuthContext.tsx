import { createContext, useEffect, useState, type ReactNode } from "react";
import { loginUser, type AuthSession } from "../services/authService";

type AuthContextValue = {
  session: AuthSession | null;
  ready: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

const SESSION_KEY = "sportsee.mock-user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(SESSION_KEY) === "user123") {
        setSession({ userId: "user123" });
      }
    } catch {
      // Si le stockage est bloqué, la session reste uniquement en mémoire.
    } finally {
      setReady(true);
    }
  }, []);

  async function login(username: string, password: string) {
    const nextSession = await loginUser(username, password);

    try {
      sessionStorage.setItem(SESSION_KEY, nextSession.userId);
    } catch {
      // La connexion fonctionne aussi sans persistance.
    }

    setSession(nextSession);
  }

  function logout() {
    try {
      sessionStorage.removeItem(SESSION_KEY);
    } catch {
      // Le stockage peut être indisponible dans certains navigateurs.
    }

    setSession(null);
  }

  return (
    <AuthContext.Provider value={{ session, ready, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
