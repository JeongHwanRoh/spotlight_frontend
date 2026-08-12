interface DonutDatum {
  code: string;
  label: string;
  pct: number;
  color: string;
}

interface DonutPanelProps {
  id: string;
  title: string;
  centerLabel: string;
  data: DonutDatum[];
}

function buildConicGradient(data: DonutDatum[]) {
  let acc = 0;
  const stops = data.map((d) => {
    const start = acc;
    acc += d.pct;
    return `${d.color} ${start}% ${acc}%`;
  });
  return `conic-gradient(${stops.join(", ")})`;
}

export default function DonutPanel({ id, title, centerLabel, data }: DonutPanelProps) {
  return (
    <article className="panel" id={id}>
      <h2>{title}</h2>
      <div className="donut-card">
        <div className="donut" style={{ background: buildConicGradient(data) }}>
          <span>{centerLabel}</span>
        </div>
        <ul className="legend">
          {data.map((d) => (
            <li key={d.code}>
              <i style={{ ["--c" as string]: d.color }} />
              {d.label} {d.pct}%
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
