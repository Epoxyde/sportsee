import { useUserActivity } from "../hooks/useUserActivity";
import { buildProfileActivityStats } from "../utils/buildProfileActivityStats";
import { getLocalDate } from "../utils/dates";
import { ProfileStatCard } from "./ProfileStatCard";

export function ProfileActivityStats({ createdAt }: { createdAt: string }) {
  const today = getLocalDate();
  const { activities, loading, error } = useUserActivity(createdAt, today);
  const stats = buildProfileActivityStats(activities, createdAt, today);
  const placeholder = <span className="text-base">{loading ? "Chargement…" : "Indisponible"}</span>;
  const ready = !loading && !error;

  return (
    <div className="profile-stat-column" aria-busy={loading}>
      <ProfileStatCard label="Calories brûlées"
        value={ready ? stats.calories.toLocaleString("fr-FR") : placeholder}
        unit={ready ? "cal" : undefined} />
      <ProfileStatCard label="Nombre de jours de repos"
        value={ready ? stats.restDays.toLocaleString("fr-FR") : placeholder}
        unit={ready ? (stats.restDays === 1 ? "jour" : "jours") : undefined} />
      {error && <p role="alert" className="text-sm text-[#707070]">Impossible de charger les calories et les jours de repos.</p>}
    </div>
  );
}
