import { useState, type ReactNode } from "react";
import { useUserActivity } from "../hooks/useUserActivity";
import { buildDailyHeartRate } from "../utils/buildDailyHeartRate";
import { getCurrentWeekStart, shiftDate } from "../utils/dates";
import { DailyHeartRateChart } from "./DailyHeartRateChart";
import { PeriodNavigation } from "./PeriodNavigation";

function HeartRatePeriod({ startDate, navigation }: { startDate: string; navigation: ReactNode }) {
  const { activities, loading, error } = useUserActivity(startDate, shiftDate(startDate, 6));
  const { days, averageHeartRate } = buildDailyHeartRate(activities, startDate);

  return (
    <>
      <div className="flex min-h-[32px] items-center justify-between gap-3">
        <h3 className="min-w-0 text-[22px] leading-[26px] font-medium text-[#f4320b]">
          {loading || error || averageHeartRate === null ? "— BPM" : `${Math.round(averageHeartRate)} BPM`}
        </h3>
        {navigation}
      </div>
      <p className="mt-2 mb-8 text-xs text-[#707070]">Fréquence cardiaque moyenne</p>
      {loading ? (
        <p role="status" className="min-h-[325px] py-8">Chargement des fréquences cardiaques…</p>
      ) : error ? (
        <p role="alert" className="min-h-[325px] py-8">{error}</p>
      ) : activities.length === 0 ? (
        <p role="status" className="min-h-[325px] py-8 text-sm text-[#707070]">Aucune séance sur cette période.</p>
      ) : (
        <DailyHeartRateChart days={days} />
      )}
    </>
  );
}

export function HeartRatePerformance() {
  const [startDate, setStartDate] = useState(() => getCurrentWeekStart());

  return (
    <article aria-label="Fréquence cardiaque sur une semaine"
      className="chart-card w-full max-w-[583px] rounded-[10px] bg-white text-[#111] shadow-[0px_4px_84px_-40px_rgba(157,167,251,0.4)]">
      <HeartRatePeriod key={startDate} startDate={startDate} navigation={
        <PeriodNavigation startDate={startDate} endDate={shiftDate(startDate, 6)}
          previousLabel="Afficher la semaine précédente" nextLabel="Afficher la semaine suivante"
          onPrevious={() => setStartDate((date) => shiftDate(date, -7))}
          onNext={() => setStartDate((date) => shiftDate(date, 7))} />
      } />
    </article>
  );
}
