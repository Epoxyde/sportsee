import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { WeeklyDistance } from "../utils/buildWeeklyDistance";
import { formatChartDate } from "../utils/dates";

export function formatDistance(distance: number): string {
  return distance.toLocaleString("fr-FR", { maximumFractionDigits: 2 });
}

export function WeeklyDistanceChart({ weeks }: { weeks: WeeklyDistance[] }) {
  return (
    <>
      <div className="performance-chart distance-chart h-[325px] w-full min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={weeks} margin={{ top: 8, right: 0, bottom: 4, left: 0 }} accessibilityLayer>
            <CartesianGrid vertical={false} stroke="#f1f1f1" strokeDasharray="2 3" />
            <XAxis dataKey="label" tickLine={false} axisLine={{ stroke: "#707070" }}
              tick={{ fill: "#707070", fontSize: 12 }} tickMargin={16} height={40} />
            <YAxis domain={[0, "auto"]} allowDecimals={false} tickCount={4} width={26}
              tickLine={false} axisLine={{ stroke: "#707070" }}
              tick={{ fill: "#707070", fontSize: 10 }} />
            <Tooltip cursor={false}
              content={({ active, payload }) => {
                const week = payload?.[0]?.payload as WeeklyDistance | undefined;
                if (!active || !week) return null;
                return (
                  <div className="rounded-[10px] bg-[#0f0f0f] px-3 py-5 text-white shadow-[0_4px_30px_rgba(157,167,251,0.2)]">
                    <p className="text-xs text-white/75">
                      {week.startDate.slice(8, 10)}.{week.startDate.slice(5, 7)} au {week.endDate.slice(8, 10)}.{week.endDate.slice(5, 7)}
                    </p>
                    <p className="text-base font-medium">{formatDistance(week.distance)} km</p>
                  </div>
                );
              }} />
            <Legend align="left" verticalAlign="bottom" iconSize={8}
              labelStyle={{ color: "#707070", fontSize: 12 }} />
            <Bar dataKey="distance" name="Km" legendType="circle" fill="#b6bdfc" barSize={14}
              radius={[7, 7, 7, 7]} isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <ul className="sr-only" aria-label="Distances hebdomadaires">
        {weeks.map((week) => (
          <li key={week.startDate}>
            {week.label}, du {formatChartDate(week.startDate)} au {formatChartDate(week.endDate)} : {formatDistance(week.distance)} km
          </li>
        ))}
      </ul>
    </>
  );
}
