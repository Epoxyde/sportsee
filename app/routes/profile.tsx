import { useUserInfo } from "../hooks/useUserInfo";
import { ProfileStatCard } from "../components/ProfileStatCard";
import { ProfileActivityStats } from "../components/ProfileActivityStats";

export function meta() {
  return [{ title: "SportSee — Mon profil" }];
}

export default function Profile() {
  const { user, loading, error } = useUserInfo();
  const membershipDate = user
    ? new Date(`${user.profile.createdAt}T00:00:00Z`).toLocaleDateString("fr-FR", {
        day: "numeric", month: "long", year: "numeric", timeZone: "UTC",
      })
    : "";

  return (
    <main className="profile-page">
      <h1 className="sr-only">Mon profil</h1>
      {loading ? (
        <p role="status">Chargement du profil…</p>
      ) : error ? (
        <p role="alert">{error}</p>
      ) : user ? (
        <div className="profile-layout">
          <div className="profile-personal">
            <section className="profile-identity" aria-labelledby="profile-name">
              <div className="dashboard-avatar-frame">
                <img className="dashboard-avatar" src={user.profile.profilePicture} alt="" />
              </div>
              <div className="min-w-0">
                <h2 id="profile-name" className="text-[22px] font-medium">
                  {user.profile.firstName} {user.profile.lastName}
                </h2>
                <p className="mt-1 text-sm text-[#707070]">
                  Membre depuis le <time dateTime={user.profile.createdAt}>{membershipDate}</time>
                </p>
              </div>
            </section>
            <section className="profile-details" aria-labelledby="profile-details-title">
              <h2 id="profile-details-title" className="text-[22px] font-medium">Votre profil</h2>
              <div className="profile-divider" aria-hidden="true">
                <img src="/images/profile-divider.svg" alt="" />
              </div>
              <dl>
                <div><dt>Âge :</dt><dd>{user.profile.age} ans</dd></div>
                <div><dt>Genre :</dt><dd>Indisponible</dd></div>
                <div><dt>Taille :</dt><dd>{Math.floor(user.profile.height / 100)} m {String(user.profile.height % 100).padStart(2, "0")}</dd></div>
                <div><dt>Poids :</dt><dd>{user.profile.weight.toLocaleString("fr-FR")} kg</dd></div>
              </dl>
            </section>
          </div>
          <section className="profile-statistics" aria-labelledby="profile-statistics-title">
            <header>
              <h2 id="profile-statistics-title" className="text-[22px] font-medium">Vos statistiques</h2>
              <p className="mt-1 text-sm text-[#707070]">
                depuis le <time dateTime={user.profile.createdAt}>{membershipDate}</time>
              </p>
            </header>
            <div className="profile-stat-columns">
              <div className="profile-stat-column">
                <ProfileStatCard label="Temps total couru"
                  value={`${Math.floor(user.statistics.totalDuration / 60).toLocaleString("fr-FR")} h`}
                  unit={`${user.statistics.totalDuration % 60} min`} />
                <ProfileStatCard label="Distance totale parcourue"
                  value={user.statistics.totalDistance.toLocaleString("fr-FR", { maximumFractionDigits: 1 })} unit="km" />
                <ProfileStatCard label="Nombre de sessions"
                  value={user.statistics.totalSessions.toLocaleString("fr-FR")}
                  unit={user.statistics.totalSessions === 1 ? "session" : "sessions"} />
              </div>
              <ProfileActivityStats key={user.profile.createdAt} createdAt={user.profile.createdAt} />
            </div>
          </section>
        </div>
      ) : (
        <p>Aucune information utilisateur disponible.</p>
      )}
    </main>
  );
}
