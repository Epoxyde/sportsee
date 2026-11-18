import { useState } from "react";
import { useUserInfo } from "../hooks/useUserInfo";
import { useUserActivity } from "../hooks/useUserActivity";
import { DistancePerformance } from "../components/DistancePerformance";
import { HeartRatePerformance } from "../components/HeartRatePerformance";
import { WeeklySummary } from "../components/WeeklySummary";
import { getCurrentWeekStart } from "../utils/dates";

export function meta() {
  return [
    { title: "SportSee — Dashboard" },
    { name: "description", content: "Vos informations et statistiques sportives." },
  ];
}

export default function Dashboard() {
  const { user, loading, error } = useUserInfo();
  const [startDate, setStartDate] = useState("2026-11-02");
  const [endDate, setEndDate] = useState("2026-11-08");
  const {
    activities,
    loading: activitiesLoading,
    error: activitiesError,
  } = useUserActivity(startDate, endDate);
  const periodError = !startDate || !endDate
    ? "Renseignez les deux dates."
    : startDate > endDate
      ? "La date de début doit précéder ou être égale à la date de fin."
      : null;

  return (
    <main className="mx-auto max-w-3xl space-y-6 p-8 text-gray-900 dark:text-gray-100">
      <h1 className="text-3xl font-bold">Dashboard</h1>

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
      <section className="space-y-4 rounded-xl bg-[#f2f3ff] p-6 text-[#111]" aria-labelledby="performances-title">
        <h2 id="performances-title" className="text-[22px] font-medium">Vos dernières performances</h2>
        <DistancePerformance />
        <HeartRatePerformance />
      </section>
      {/* Objectif de la maquette, absent de l'API actuelle. */}
      <WeeklySummary startDate={getCurrentWeekStart()} goal={6} />
      <section className="space-y-4" aria-labelledby="activities-title">
        <h2 id="activities-title" className="text-xl font-semibold">
          Vos séances
        </h2>

        <div className="flex flex-wrap gap-4">
          <label className="flex flex-col gap-1">
            Du
            <input
              type="date"
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
              aria-invalid={Boolean(periodError)}
              aria-describedby={periodError ? "period-error" : undefined}
              className="rounded border border-gray-400 p-2"
            />
          </label>
          <label className="flex flex-col gap-1">
            Au
            <input
              type="date"
              value={endDate}
              onChange={(event) => setEndDate(event.target.value)}
              aria-invalid={Boolean(periodError)}
              aria-describedby={periodError ? "period-error" : undefined}
              className="rounded border border-gray-400 p-2"
            />
          </label>
        </div>

        {periodError ? (
          <p id="period-error" role="alert">{periodError}</p>
        ) : activitiesLoading ? (
          <p role="status">Chargement des séances…</p>
        ) : activitiesError ? (
          <p role="alert">{activitiesError}</p>
        ) : activities.length === 0 ? (
          <p role="status">Aucune séance sur cette période.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <caption className="mb-2 text-left">
                {activities.length} séance{activities.length > 1 ? "s" : ""}
              </caption>
              <thead>
                <tr className="border-b border-gray-400">
                  <th scope="col" className="p-2">Date</th>
                  <th scope="col" className="p-2">Distance</th>
                  <th scope="col" className="p-2">Durée</th>
                  <th scope="col" className="p-2">FC moyenne</th>
                </tr>
              </thead>
              <tbody>
                {activities.map((session, index) => (
                  <tr key={`${session.date}-${index}`} className="border-b border-gray-300">
                    <td className="p-2">
                      <time dateTime={session.date}>
                        {session.date.split("-").reverse().join("/")}
                      </time>
                    </td>
                    <td className="p-2">{session.distance.toLocaleString("fr-FR")} km</td>
                    <td className="p-2">{session.duration} min</td>
                    <td className="p-2">{session.heartRate.average} BPM</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
