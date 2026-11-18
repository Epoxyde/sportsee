import { useUserActivity } from "../hooks/useUserActivity";
import { buildWeeklySummary } from "../utils/buildWeeklySummary";
import { shiftDate } from "../utils/dates";
import { WeeklyGoalChart } from "./WeeklyGoalChart";

type WeeklySummaryProps = {
  startDate: string;
  goal: number;
};

export function WeeklySummary({ startDate, goal }: WeeklySummaryProps) {
  const endDate = shiftDate(startDate, 6);
  const { activities, loading, error } = useUserActivity(startDate, endDate);
  const summary = buildWeeklySummary(activities, startDate, goal);

  return (
    <section className="space-y-8 text-[#111]" aria-labelledby="weekly-summary-title">
      <header className="space-y-2">
        <h2 id="weekly-summary-title" className="text-[22px] font-medium">Cette semaine</h2>
        <p className="text-base font-medium text-[#707070]">
          Du <time dateTime={startDate}>{startDate.split("-").reverse().join("/")}</time>
          {" au "}<time dateTime={endDate}>{endDate.split("-").reverse().join("/")}</time>
        </p>
      </header>

      {loading ? (
        <p role="status">Chargement du bilan hebdomadaire…</p>
      ) : error ? (
        <p role="alert">{error}</p>
      ) : (
        <>
          {summary.completed === 0 && <p role="status">Aucune séance sur cette semaine.</p>}
          <div className="grid gap-[30px] md:grid-cols-[minmax(0,450fr)_minmax(0,572fr)]">
            <article className="chart-card min-w-0 rounded-[10px] bg-white shadow-[0px_4px_84px_-40px_rgba(157,167,251,0.4)]">
              <h3 className="flex flex-wrap items-baseline gap-1.5">
                <span className="text-[28px] font-semibold text-[#0b23f4]">x{summary.completed}</span>
                <span className="text-base font-medium text-[#b6bdfc]">sur objectif de {goal}</span>
              </h3>
              <p className="mt-2 mb-8 text-sm text-[#707070]">Courses hebdomadaires réalisées</p>
              <WeeklyGoalChart completed={summary.completed} remaining={summary.remaining}
                progress={summary.progress} goal={goal} />
            </article>

            <div className="space-y-4">
              <article className="space-y-4 rounded-[10px] bg-white px-[30px] py-5">
                <h3 className="text-sm text-[#707070]">Durée d’activité</h3>
                <p className="font-medium">
                  <span className="text-[22px] text-[#0b23f4]">{summary.totalDuration.toLocaleString("fr-FR")}</span>
                  {" "}<span className="text-base text-[#b6bdfc]">minutes</span>
                </p>
              </article>
              <article className="space-y-4 rounded-[10px] bg-white px-[30px] py-5">
                <h3 className="text-sm text-[#707070]">Distance</h3>
                <p className="font-medium">
                  <span className="text-[22px] text-[#f4320b]">
                    {summary.totalDistance.toLocaleString("fr-FR", { maximumFractionDigits: 2 })}
                  </span>
                  {" "}<span className="text-base text-[#fcc1b6]">kilomètres</span>
                </p>
              </article>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
