import { createContext, useCallback, useEffect, useState, type ReactNode } from "react";
import axios from "axios";
import { getSessionExpiration, isValidSession, loginUser, type AuthSession } from "../services/authService";
import { api } from "../services/api";

type AuthContextValue = {
  session: AuthSession | null;
  ready: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

const SESSION_KEY = "sportsee.session";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      sessionStorage.removeItem("sportsee.mock-user");
      const savedSession = sessionStorage.getItem(SESSION_KEY);
      const restoredSession: unknown = savedSession ? JSON.parse(savedSession) : null;
      if (isValidSession(restoredSession)) {
        api.defaults.headers.common.Authorization = `Bearer ${restoredSession.token}`;
        setSession(restoredSession);
      } else {
        sessionStorage.removeItem(SESSION_KEY);
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
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(nextSession));
    } catch {
      // La connexion fonctionne aussi sans persistance.
    }

    api.defaults.headers.common.Authorization = `Bearer ${nextSession.token}`;
    setSession(nextSession);
  }

  const logout = useCallback(() => {
    try {
      sessionStorage.removeItem(SESSION_KEY);
    } catch {
      // Le stockage peut être indisponible dans certains navigateurs.
    }

    delete api.defaults.headers.common.Authorization;
    setSession(null);
  }, []);

  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (response) => response,
      (error: unknown) => {
        if (axios.isAxiosError(error)) {
          const status = error.response?.status;
          const requestToken = error.config?.headers.get("Authorization");
          const currentToken = api.defaults.headers.common.Authorization;

          // Une ancienne requête ne doit pas déconnecter une nouvelle session.
          // Les erreurs de connexion restent gérées par le formulaire.
          if ((status === 401 || status === 403)
            && error.config?.url !== "/login"
            && currentToken && requestToken === currentToken) {
            logout();
          }
        }
        return Promise.reject(error);
      },
    );

    return () => api.interceptors.response.eject(interceptor);
  }, [logout]);

  useEffect(() => {
    if (!session) return;

    function checkExpiration() {
      if (session && getSessionExpiration(session) <= Date.now()) logout();
    }

    const timer = window.setTimeout(logout, Math.max(0, getSessionExpiration(session) - Date.now()));
    window.addEventListener("focus", checkExpiration);
    document.addEventListener("visibilitychange", checkExpiration);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("focus", checkExpiration);
      document.removeEventListener("visibilitychange", checkExpiration);
    };
  }, [session, logout]);

  return (
    <AuthContext.Provider value={{ session, ready, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
