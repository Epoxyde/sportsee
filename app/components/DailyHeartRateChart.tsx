import { Bar, CartesianGrid, ComposedChart, DefaultLegendContent, Legend, Line, ResponsiveContainer, XAxis, YAxis } from "recharts";
import type { DailyHeartRate } from "../utils/buildDailyHeartRate";

export function DailyHeartRateChart({ days }: { days: DailyHeartRate[] }) {
  const measurements = days.flatMap((day) => day.min === null || day.max === null ? [] : [day.min, day.max]);
  // L'axe s'adapte aux mesures, au lieu de couper les valeurs hors de la maquette.
  const lowerBound = measurements.length ? Math.max(0, Math.floor((Math.min(...measurements) - 5) / 5) * 5) : 0;
  const upperBound = measurements.length ? Math.ceil((Math.max(...measurements) + 5) / 5) * 5 : 200;

  return (
    <>
      <div className="performance-chart heart-rate-chart h-[325px] w-full min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={days} margin={{ top: 8, right: 4, bottom: 4, left: 0 }} barGap={4} accessibilityLayer>
            <CartesianGrid vertical={false} stroke="#f1f1f1" strokeDasharray="2 3" />
            <XAxis dataKey="label" interval={0} tickLine={false} axisLine={{ stroke: "#707070" }}
              tick={{ fill: "#707070", fontSize: 12 }} tickMargin={16} height={40} />
            <YAxis domain={[lowerBound, upperBound]} allowDataOverflow allowDecimals={false} tickCount={4} width={32}
              tickLine={false} axisLine={{ stroke: "#707070" }} tick={{ fill: "#707070", fontSize: 10 }} />
            <Legend align="left" verticalAlign="bottom" iconSize={8}
              itemSorter={(item) => ["min", "max", "average"].indexOf(String(item.dataKey))}
              content={({ payload, ...props }) => (
                <DefaultLegendContent {...props} payload={payload?.map((item) =>
                  item.dataKey === "average"
                    ? {
                        ...item,
                        type: "line",
                        color: "#b6bdfc",
                        dot: { symbol: "circle", fill: "#0b23f4", stroke: "white" },
                      }
                    : item
                )} />
              )}
              labelStyle={{ color: "#707070", fontSize: 12 }} />
            <Bar dataKey="min" name="Min" legendType="circle" fill="#fcc1b6" barSize={14} radius={[7, 7, 7, 7]} isAnimationActive={false} />
            <Bar dataKey="max" name="Max BPM" legendType="circle" fill="#f4320b" barSize={14} radius={[7, 7, 7, 7]} isAnimationActive={false} />
            <Line dataKey="average" name="Moyenne BPM" type="monotone" connectNulls={false}
              stroke="#f2f3ff" strokeWidth={2}
              dot={{ r: 3, fill: "#0b23f4", stroke: "white", strokeWidth: 1 }}
              activeDot={false} isAnimationActive={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <ul className="sr-only" aria-label="Mesures cardiaques quotidiennes">
        {days.map((day) => (
          <li key={day.date}>
            {day.label} {day.date} : {day.min === null ? "aucune mesure" :
              `minimum ${day.min}, maximum ${day.max}, moyenne ${day.average === null ? "indisponible" : Math.round(day.average)} BPM`}
          </li>
        ))}
      </ul>
    </>
  );
}
