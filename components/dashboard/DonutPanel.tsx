"use client";

import { useState } from "react";

interface DonutDatum {
  code: string;
  label: string;
  // 도넛 조각의 비율 계산용 값이다. tooltipLabel이 없으면 툴팁 표시값으로도 사용한다.
  pct: number;
  color: string;
  // 시간대별 매출처럼 백엔드 금액 라벨이 있는 경우 툴팁에 pct 대신 표시한다.
  tooltipLabel?: string;
}

interface DonutPanelProps {
  id: string;
  title: string;
  centerLabel: string;
  data: DonutDatum[];
}

interface TooltipState {
  // 도넛 내부에서 툴팁을 띄울 상대 좌표
  x: number;
  y: number;
  datum: DonutDatum;
}

// data의 pct 누적값을 conic-gradient 구간으로 변환해 도넛 배경을 만든다.
function buildConicGradient(data: DonutDatum[]) {
  let acc = 0;
  const stops = data.map((d) => {
    const start = acc;
    acc += d.pct;
    return `${d.color} ${start}% ${acc}%`;
  });
  return `conic-gradient(${stops.join(", ")})`;
}

// 마우스 위치의 각도를 pct 구간으로 바꿔 현재 커서가 올라간 도넛 조각을 찾는다.
function findDatumByPointer(
  e: React.MouseEvent<HTMLDivElement>,
  data: DonutDatum[]
) {
  const rect = e.currentTarget.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  const x = e.clientX - centerX;
  const y = e.clientY - centerY;

  // 도넛 중앙 구멍 위에서는 tooltip을 숨김
  const distance = Math.sqrt(x * x + y * y);
  if (distance < rect.width * 0.34) {
    return null;
  }

  // CSS conic-gradient는 12시 방향부터 시작하므로 atan2 결과를 보정
  const angle = (Math.atan2(y, x) * 180) / Math.PI;
  const normalizedAngle = (angle + 90 + 360) % 360;
  const pointerPct = (normalizedAngle / 360) * 100;

  let acc = 0;
  return (
    data.find((datum) => {
      acc += datum.pct;
      return pointerPct <= acc;
    }) ?? null
  );
}

export default function DonutPanel({ id, title, centerLabel, data }: DonutPanelProps) {
  // null이면 툴팁을 숨기고, 값이 있으면 해당 도넛 조각의 정보를 표시한다.
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const datum = findDatumByPointer(e, data);

    if (!datum) {
      setTooltip(null);
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();

    setTooltip({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      datum,
    });
  }

  return (
    <article className="panel" id={id}>
      <h2>{title}</h2>
      <div className="donut-card">
        <div
          className="donut"
          style={{ background: buildConicGradient(data) }}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setTooltip(null)}
        >
          <span>{centerLabel}</span>

          {tooltip && (
            <div
              className="donut-tooltip"
              style={{
                left: tooltip.x,
                top: tooltip.y,
              }}
            >
              <strong>{tooltip.datum.label}</strong>
              {/* tooltipLabel이 있으면 금액을, 없으면 기존 pct를 보여준다. */}
              <b>{tooltip.datum.tooltipLabel ?? `${tooltip.datum.pct}%`}</b>
            </div>
          )}
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