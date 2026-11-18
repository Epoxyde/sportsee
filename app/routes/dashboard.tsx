import { useUserInfo } from "../hooks/useUserInfo";
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

  return (
    <main className="dashboard-page">
      <h1 className="sr-only">Dashboard</h1>
      {loading ? (
        <p role="status">Chargement du profil…</p>
      ) : error ? (
        <p role="alert">{error}</p>
      ) : user ? (
        <section className="dashboard-profile" aria-labelledby="profile-title">
          <div className="dashboard-identity">
            <div className="dashboard-avatar-frame">
              <img className="dashboard-avatar" src={user.profile.profilePicture} alt="" />
            </div>
            <div>
              <h2 id="profile-title" className="text-[22px] font-medium">
                {user.profile.firstName} {user.profile.lastName}
              </h2>
              <p className="mt-1 text-sm text-[#707070]">
                Membre depuis le <time dateTime={user.profile.createdAt}>
                  {new Date(`${user.profile.createdAt}T00:00:00Z`).toLocaleDateString("fr-FR", {
                    day: "numeric", month: "long", year: "numeric", timeZone: "UTC",
                  })}
                </time>
              </p>
            </div>
          </div>
          <div className="dashboard-total">
            <span className="text-sm text-[#707070]">Distance totale parcourue</span>
            <p className="dashboard-distance">
              <img src="/images/distance-badge.svg" alt="" width="32" height="32" />
              <span>{user.statistics.totalDistance.toLocaleString("fr-FR", { maximumFractionDigits: 1 })} km</span>
            </p>
          </div>
        </section>
      ) : (
        <p>Aucune information utilisateur disponible.</p>
      )}
      <section className="space-y-8" aria-labelledby="performances-title">
        <h2 id="performances-title" className="text-[22px] font-medium">Vos dernières performances</h2>
        <div className="dashboard-charts">
          <DistancePerformance />
          <HeartRatePerformance />
        </div>
      </section>
      {/* Objectif de la maquette, absent de l'API actuelle. */}
      <WeeklySummary startDate={getCurrentWeekStart()} goal={6} />
    </main>
  );
}
