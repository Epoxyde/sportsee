import { useUserInfo } from "../hooks/useUserInfo";

export function meta() {
  return [{ title: "SportSee — Mon profil" }];
}

export default function Profile() {
  const { user, loading, error } = useUserInfo();

  return (
    <main className="mx-auto max-w-3xl space-y-6 p-8">
      <h1 className="text-3xl font-bold">Mon profil</h1>
      {loading ? (
        <p role="status">Chargement du profil…</p>
      ) : error ? (
        <p role="alert">{error}</p>
      ) : user ? (
        <>
          <h2 className="text-2xl font-semibold">
            {user.profile.firstName} {user.profile.lastName}
          </h2>
          <p>
            Membre depuis le{" "}
            <time dateTime={user.profile.createdAt}>
              {user.profile.createdAt.split("-").reverse().join("/")}
            </time>
          </p>
          <ul className="space-y-2">
            <li>Âge : {user.profile.age} ans</li>
            <li>Taille : {user.profile.height} cm</li>
            <li>Poids : {user.profile.weight} kg</li>
          </ul>
          <section className="space-y-3" aria-labelledby="profile-statistics">
            <h2 id="profile-statistics" className="text-xl font-semibold">
              Vos statistiques
            </h2>
            <ul className="space-y-2">
              <li>Distance totale : {user.statistics.totalDistance.toLocaleString("fr-FR")} km</li>
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
