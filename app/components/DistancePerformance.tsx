import { useState, type ReactNode } from "react";
import { useUserActivity } from "../hooks/useUserActivity";
import { buildWeeklyDistance } from "../utils/buildWeeklyDistance";
import { getCurrentWeekStart, shiftDate } from "../utils/dates";
import { formatDistance, WeeklyDistanceChart } from "./WeeklyDistanceChart";
import { PeriodNavigation } from "./PeriodNavigation";

function DistancePeriod({ startDate, navigation }: { startDate: string; navigation: ReactNode }) {
  const endDate = shiftDate(startDate, 27);
  const { activities, loading, error } = useUserActivity(startDate, endDate);

  const { weeks, averageDistance } = buildWeeklyDistance(activities, startDate);

  return (
    <>
      <div className="flex min-h-[32px] items-center justify-between gap-3">
        <h3 className="shrink-0 whitespace-nowrap text-[22px] leading-[26px] font-medium text-[#0b23f4]">
          {loading || error ? "Distance moyenne" : `${formatDistance(averageDistance)} km en moyenne`}
        </h3>
        {navigation}
      </div>
      <p className="mt-2 mb-8 text-xs text-[#707070]">Total des kilomètres 4 dernières semaines</p>
      {loading ? (
        <p role="status" className="min-h-[325px] py-8">Chargement des distances…</p>
      ) : error ? (
        <p role="alert" className="min-h-[325px] py-8">{error}</p>
      ) : (
        <>
          {activities.length === 0 && (
            <p role="status" className="mb-4 text-sm text-[#707070]">Aucune séance sur cette période.</p>
          )}
          <WeeklyDistanceChart weeks={weeks} />
        </>
      )}
    </>
  );
}

export function DistancePerformance() {
  // La semaine actuelle et les trois précédentes, du lundi au dimanche.
  const [startDate, setStartDate] = useState(() => shiftDate(getCurrentWeekStart(), -21));
  const endDate = shiftDate(startDate, 27);

  return (
    <article aria-label="Kilomètres parcourus sur quatre semaines"
      className="chart-card w-full max-w-[520px] rounded-[10px] bg-white text-[#111] shadow-[0px_4px_84px_-40px_rgba(157,167,251,0.4)]">
      {/* Une nouvelle période repart avec son propre chargement, sans montrer les anciennes données. */}
      <DistancePeriod key={startDate} startDate={startDate} navigation={
        <PeriodNavigation startDate={startDate} endDate={endDate}
          previousLabel="Afficher les quatre semaines précédentes" nextLabel="Afficher les quatre semaines suivantes"
          onPrevious={() => setStartDate((date) => shiftDate(date, -28))}
          onNext={() => setStartDate((date) => shiftDate(date, 28))} />
      } />
    </article>
  );
}
