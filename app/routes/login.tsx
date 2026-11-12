import { useState, type SubmitEvent } from "react";
import { Navigate, useLocation } from "react-router";
import { useAuth } from "../hooks/useAuth";

export function meta() {
  return [{ title: "SportSee — Connexion" }];
}

export default function Login() {
  const { session, ready, login } = useAuth();
  const location = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const from = location.state?.from;
  const destination = from === "/profile" ? "/profile" : "/dashboard";

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError(null);

    try {
      await login(username.trim(), password);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Connexion impossible.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!ready) {
    return <p role="status" className="p-8">Chargement de la session…</p>;
  }

  if (session) {
    return <Navigate to={destination} replace />;
  }

  return (
    <main className="mx-auto max-w-md space-y-6 p-8">
      <h1 className="text-3xl font-bold">Connexion à SportSee</h1>
      <p>Mode démonstration : connectez-vous avec le compte de Sophie.</p>
      <p className="text-sm">
        Identifiant : <code>sophiemartin</code><br />
        Mot de passe : <code>password123</code>
      </p>
      <form onSubmit={handleSubmit} className="space-y-4" aria-busy={submitting}>
        <label className="flex flex-col gap-2">
          Identifiant
          <input
            name="username"
            autoComplete="username"
            required
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            className="rounded border border-gray-400 p-2"
          />
        </label>
        <label className="flex flex-col gap-2">
          Mot de passe
          <input
            type="password"
            name="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="rounded border border-gray-400 p-2"
          />
        </label>
        {error && <p role="alert">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="cursor-pointer rounded bg-blue-700 px-4 py-2 text-white disabled:cursor-wait disabled:opacity-60"
        >
          {submitting ? "Connexion en cours…" : "Se connecter"}
        </button>
      </form>
    </main>
  );
}
