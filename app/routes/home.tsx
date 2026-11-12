import { useUserInfo } from "../hooks/useUserInfo";

export function meta() {
  return [
    { title: "SportSee — Profil" },
    { name: "description", content: "Vos informations et statistiques sportives." },
  ];
}

export default function Home() {
  const { user, loading, error } = useUserInfo();

  return (
    <main className="mx-auto max-w-3xl space-y-6 p-8 text-gray-900 dark:text-gray-100">
      <h1 className="text-3xl font-bold">SportSee</h1>

      {loading ? (
        <p role="status">Chargement du profil…</p>
      ) : error ? (
        <p role="alert">{error}</p>
      ) : user ? (
        <>
          <section className="space-y-3" aria-labelledby="profile-title">
            <h2 id="profile-title" className="text-2xl font-semibold">
              Bonjour {user.profile.firstName} {user.profile.lastName}
            </h2>
            <ul className="space-y-1">
              <li>Âge : {user.profile.age} ans</li>
              <li>Taille : {user.profile.height} cm</li>
              <li>Poids : {user.profile.weight} kg</li>
            </ul>
          </section>

          <section className="space-y-3" aria-labelledby="statistics-title">
            <h2 id="statistics-title" className="text-xl font-semibold">
              Vos statistiques
            </h2>
            <ul className="space-y-1">
              <li>
                Distance totale : {user.statistics.totalDistance.toLocaleString("fr-FR")} km
              </li>
              <li>Nombre de séances : {user.statistics.totalSessions}</li>
              <li>
                Durée totale : {Math.floor(user.statistics.totalDuration / 60)} h{" "}
                {user.statistics.totalDuration % 60} min
              </li>
            </ul>
          </section>
        </>
      ) : (
        <p>Aucune information utilisateur disponible.</p>
      )}
    </main>
  );
}
