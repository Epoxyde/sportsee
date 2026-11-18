import { useState, type ReactNode } from "react";
import { useUserActivity } from "../hooks/useUserActivity";
import { buildWeeklyDistance, shiftDate } from "../utils/buildWeeklyDistance";
import { formatChartDate, formatDistance, WeeklyDistanceChart } from "./WeeklyDistanceChart";

function DistancePeriod({ startDate, navigation }: { startDate: string; navigation: ReactNode }) {
  const endDate = shiftDate(startDate, 27);
  const { activities, loading, error } = useUserActivity(startDate, endDate);

  const { weeks, averageDistance } = buildWeeklyDistance(activities, startDate);

  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <h3 className="min-w-0 text-[22px] font-medium text-[#0b23f4]">
          {loading || error ? "Distance moyenne" : `${formatDistance(averageDistance)} km en moyenne`}
        </h3>
        {navigation}
      </div>
      <p className="mt-2 mb-8 text-xs text-[#707070]">Total des kilomètres 4 dernières semaines</p>
      {loading ? (
        <p role="status" className="min-h-[325px] py-8">Chargement des distances…</p>
      ) : error ? (
        <p role="alert" className="min-h-[325px] py-8">{error}</p>
      ) : <>
      {activities.length === 0 && (
        <p role="status" className="mb-4 text-sm text-[#707070]">Aucune séance sur cette période.</p>
      )}
      <WeeklyDistanceChart weeks={weeks} />
      </>}
    </>
  );
}

export function DistancePerformance() {
  // Période de démonstration couverte par nos mocks, du lundi au dimanche.
  const [startDate, setStartDate] = useState("2026-10-12");
  const endDate = shiftDate(startDate, 27);
  const startYear = startDate.slice(0, 4);
  const endYear = endDate.slice(0, 4);
  const currentYear = String(new Date().getFullYear());
  const showYear = startYear !== currentYear || endYear !== currentYear;
  const buttonClass = "flex size-[26px] shrink-0 cursor-pointer items-center justify-center rounded-[10px] border border-[#717171] bg-white text-[#707070] transition-colors duration-200 ease-in-out hover:border-[#0b23f4] hover:bg-[#5465f7] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0b23f4] motion-reduce:transition-none";

  return (
    <article aria-label="Kilomètres parcourus sur quatre semaines"
      className="w-full max-w-[520px] rounded-[10px] bg-white px-6 pt-4 pb-6 text-[#111] shadow-[0px_4px_84px_-40px_rgba(157,167,251,0.4)] sm:px-10">
      {/* Une nouvelle période repart avec son propre chargement, sans montrer les anciennes données. */}
      <DistancePeriod key={startDate} startDate={startDate} navigation={
      <div className="flex shrink-0 items-center gap-1.5">
        <button type="button" aria-label="Afficher les quatre semaines précédentes"
          onClick={() => setStartDate((date) => shiftDate(date, -28))} className={buttonClass}>
          <span aria-hidden="true" className="ml-0.5 size-1.5 rotate-135 border-r border-b border-current" />
        </button>
        <p className="text-center text-xs" aria-live="polite" aria-atomic="true">
          <time dateTime={startDate}>{formatChartDate(startDate)}</time>
          {" – "}<time dateTime={endDate}>{formatChartDate(endDate)}</time>
          {showYear && (
            <span className="block text-[10px] text-[#707070]">
              {startYear === endYear ? startYear : `${startYear} – ${endYear}`}
            </span>
          )}
        </p>
        <button type="button" aria-label="Afficher les quatre semaines suivantes"
          onClick={() => setStartDate((date) => shiftDate(date, 28))} className={buttonClass}>
          <span aria-hidden="true" className="mr-0.5 size-1.5 -rotate-45 border-r border-b border-current" />
        </button>
      </div>
      } />
    </article>
  );
}
