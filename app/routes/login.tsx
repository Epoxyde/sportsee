import { useState, type SubmitEvent } from "react";
import { Navigate, useLocation } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { SiteHeader } from "../components/SiteHeader";

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
    <main className="login-page">
      <section className="login-panel" aria-labelledby="login-heading">
        <SiteHeader className="login-header" />
        <div className="login-card">
          <h1 id="login-heading">Transformez<br />vos stats en résultats</h1>
          <form onSubmit={handleSubmit} aria-busy={submitting}>
            <h2>Se connecter</h2>
            <label className="login-field">
              Identifiant
              <input
                name="username" autoComplete="username" autoCapitalize="none" spellCheck={false}
                required value={username}
                onChange={(event) => setUsername(event.target.value)}
                aria-describedby={error ? "login-error" : undefined}
              />
            </label>
            <label className="login-field">
              Mot de passe
              <input
                type="password" name="password" autoComplete="current-password"
                required value={password}
                onChange={(event) => setPassword(event.target.value)}
                aria-describedby={error ? "login-error" : undefined}
              />
            </label>
            {error && <p id="login-error" role="alert" className="login-error">{error}</p>}
            <button type="submit" disabled={submitting} className="login-submit">
              {submitting ? "Connexion en cours…" : "Se connecter"}
            </button>
          </form>
          <p className="login-password-help">Mot de passe oublié ?</p>
        </div>
      </section>
      <div className="login-visual">
        <img className="login-picture" src="/images/login-runners.jpg" alt="" />
        <p className="login-caption">
          Analysez vos performances en un clin d’œil,<br />
          suivez vos progrès et atteignez vos objectifs.
        </p>
      </div>
    </main>
  );
}
