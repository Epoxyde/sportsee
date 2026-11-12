import { Link } from "react-router";

export function meta() {
  return [{ title: "SportSee — Page introuvable" }];
}

export default function NotFound() {
  return (
    <main className="mx-auto max-w-3xl space-y-6 p-8">
      <h1 className="text-3xl font-bold">404 — Page introuvable</h1>
      <p>La page demandée n’existe pas.</p>
      <Link to="/" className="text-blue-600 underline dark:text-blue-400">
        Retour à l’accueil
      </Link>
    </main>
  );
}
