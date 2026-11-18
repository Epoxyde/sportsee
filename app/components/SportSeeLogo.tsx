import { useId, type CSSProperties } from "react";

// Géométrie du SVG fourni, dans l'ordre de gauche à droite.
const bars = [
  { x: 0, lowerY: 11, lowerHeight: 8, upperHeight: 11, rise: 0.45 },
  { x: 4, lowerY: 7.65625, lowerHeight: 13, upperHeight: 14, rise: 0.45 },
  { x: 8, lowerY: 11.3281, lowerHeight: 5, upperHeight: 12, rise: 0.20 },
  { x: 12, lowerY: 11, lowerHeight: 9, upperHeight: 9, rise: 0.70 },
  { x: 16, lowerY: 11.3281, lowerHeight: 6, upperHeight: 14, rise: 0.20 },
];

export function SportSeeLogo({ markOnly = false }: { markOnly?: boolean }) {
  const id = useId();
  const lowerGradient = `${id}-lower`;
  const upperGradient = `${id}-upper`;

  return (
    <span className="inline-flex items-center gap-[5px]" role="img" aria-label="SportSee">
      <svg className="sportsee-mark" width="19" height="21" viewBox="0 0 19 21" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id={lowerGradient} x1="0" y1="0" x2="0" y2="1">
            <stop stopColor="#F4320B" />
            <stop offset="1" stopColor="#5465F7" />
          </linearGradient>
          <linearGradient id={upperGradient} x1="0" y1="0" x2="0" y2="1">
            <stop stopColor="#F99885" />
            <stop offset="1" stopColor="#DF392B" />
          </linearGradient>
        </defs>
        {bars.map((bar) => (
          <g key={bar.x}>
            <rect x={bar.x} y={bar.lowerY} width="3" height={bar.lowerHeight} rx="1.5" fill={`url(#${lowerGradient})`} />
            <rect
              className="sportsee-mark-upper"
              x={bar.x}
              // Au départ, les deux rectangles ont le même bord inférieur.
              y={bar.lowerY + bar.lowerHeight - bar.upperHeight}
              width="3" height={bar.upperHeight} rx="1.5"
              fill={`url(#${upperGradient})`}
              style={{ "--logo-rise": `${-bar.upperHeight * bar.rise}px` } as CSSProperties}
            />
          </g>
        ))}
      </svg>
      {!markOnly && <img src="/images/sportsee-wordmark.svg" alt="" width="132.971" height="23.4062" />}
    </span>
  );
}
