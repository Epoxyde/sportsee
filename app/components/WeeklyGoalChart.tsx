import { Dot, Pie, PieChart, ResponsiveContainer, Text } from "recharts";
import type { PieLabelRenderProps } from "recharts";

type WeeklyGoalChartProps = {
  completed: number;
  remaining: number;
  progress: number;
  goal: number;
};

export function WeeklyGoalChart({ completed, remaining, progress, goal }: WeeklyGoalChartProps) {
  const data = [
    { name: `${completed} réalisée${completed > 1 ? "s" : ""}`, value: progress, fill: "#0b23f4" },
    { name: `${remaining} restante${remaining > 1 ? "s" : ""}`, value: remaining, fill: "#b6bdfc" },
  ];

  function renderLabel({ cx, cy, midAngle, outerRadius, index }: PieLabelRenderProps) {
    const entry = data[index];
    if (!entry || entry.value === 0) return null;
    // Pour un cercle plein, garder le libellé en diagonale afin qu'il reste dans la carte.
    const angle = entry.value === goal
      ? (index === 0 ? 2 * Math.PI / 3 : -Math.PI / 3)
      : -(midAngle ?? 0) * Math.PI / 180;
    const radius = Number(outerRadius) + 12;
    const x = Number(cx) + radius * Math.cos(angle);
    const y = Number(cy) + radius * Math.sin(angle);
    const right = x >= Number(cx);

    return (
      <g>
        <Dot cx={x} cy={y} r={3} fill={entry.fill} stroke="none" />
        <Text x={x + (right ? 7 : -7)} y={y} textAnchor={right ? "start" : "end"}
          verticalAnchor="middle" fill="#707070" fontSize={10}>
          {entry.name}
        </Text>
      </g>
    );
  }

  return (
    <div className="h-[200px] w-full min-w-0" role="img"
      aria-label={`${completed} courses réalisées sur un objectif de ${goal}, ${remaining} restantes.`}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }} accessibilityLayer={false}>
          <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%"
            innerRadius={40} outerRadius={80} startAngle={0} endAngle={-360}
            stroke="none" labelLine={false} label={renderLabel} isAnimationActive={false} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
