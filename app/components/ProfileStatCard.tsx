import type { ReactNode } from "react";

type ProfileStatCardProps = {
  label: string;
  value: ReactNode;
  unit?: string;
};

export function ProfileStatCard({ label, value, unit }: ProfileStatCardProps) {
  return (
    <article className="profile-stat-card">
      <h3>{label}</h3>
      <p className="flex flex-wrap items-baseline gap-1 font-medium">
        <span className="text-[22px]">{value}</span>
        {unit && <span className="text-base text-[#b6bdfc]">{unit}</span>}
      </p>
    </article>
  );
}
