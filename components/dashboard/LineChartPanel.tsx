import { WEEKDAY_SALES } from "@/lib/mockData";

const CHART_TOP = 20;
const CHART_BOTTOM = 180;
const X_START = 60;
const X_END = 390;

function toPoint(index: number, pct: number) {
  const x = X_START + (index * (X_END - X_START)) / (WEEKDAY_SALES.length - 1);
  const y = CHART_BOTTOM - (pct / 100) * (CHART_BOTTOM - CHART_TOP);
  return { x, y };
}

export default function LineChartPanel() {
  const points = WEEKDAY_SALES.map((d, i) => toPoint(i, d.pct));
  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x} ${p.y}`).join(" ");
  const areaPath = `${linePath} V${CHART_BOTTOM} H${points[0].x} Z`;

  const peakIndex = WEEKDAY_SALES.reduce(
    (best, d, i) => (d.pct > WEEKDAY_SALES[best].pct ? i : best),
    0
  );
  const peakPoint = points[peakIndex];

  return (
    <article className="panel" id="weekday">
      <h2>요일별 매출분포</h2>
      <svg className="line-chart" viewBox="0 0 420 220" role="img" aria-label="요일별 매출분포 라인차트">
        <path className="axis" d={`M45 20 V180 H395`} />
        <path className="area" d={areaPath} />
        <path className="line" d={linePath} />
        <g className="points">
          {points.map((p, i) => (
            <circle key={WEEKDAY_SALES[i].key} cx={p.x} cy={p.y} r={i === peakIndex ? 7 : 5} />
          ))}
        </g>
        <text x={peakPoint.x - 15} y={peakPoint.y - 14}>
          최고
        </text>
        <g className="x-labels">
          {points.map((p, i) => (
            <text key={WEEKDAY_SALES[i].key} x={p.x - 4} y="207">
              {WEEKDAY_SALES[i].label}
            </text>
          ))}
        </g>
      </svg>
    </article>
  );
}
