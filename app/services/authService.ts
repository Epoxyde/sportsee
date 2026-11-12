import axios from "axios";
import { api } from "./api";

export type AuthSession = {
  userId: string;
  token: string;
};

// Lire l'expiration ne vérifie pas la signature : cela reste le rôle du backend.
export function getSessionExpiration(session: AuthSession): number {
  try {
    const payload = session.token.split(".")[1];
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const { exp } = JSON.parse(atob(base64));
    return typeof exp === "number" && Number.isFinite(exp) ? exp * 1000 : 0;
  } catch {
    return 0;
  }
}

export function isValidSession(value: unknown): value is AuthSession {
  if (typeof value !== "object" || value === null) return false;
  return "userId" in value && typeof value.userId === "string" && value.userId.length > 0
    && "token" in value && typeof value.token === "string"
    && getSessionExpiration(value as AuthSession) > Date.now();
}

export async function loginUser(username: string, password: string): Promise<AuthSession> {
  try {
    const { data } = await api.post<unknown>("/login", { username, password });
    if (!isValidSession(data)) {
      throw new Error("La réponse du serveur ne contient pas de session valide.");
    }
    return { userId: data.userId, token: data.token };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        throw new Error("Identifiant ou mot de passe incorrect.");
      }
      if (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT") {
        throw new Error("Le serveur met trop de temps à répondre. Réessayez.");
      }
      if (!error.response) {
        throw new Error("Impossible de joindre le serveur. Vérifiez que le backend est démarré.");
      }
      throw new Error("Connexion impossible pour le moment. Réessayez.");
    }
    throw error;
  }
}
