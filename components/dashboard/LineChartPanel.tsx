import { SERVICES, type SalesByDays } from "@/lib/mockData";

/* 
참고) SVG(Scalable Vector Graphics): 문서의 왼쪽 위 모서리(0, 0)를 기준으로 하는 2차원 그리드 시스템
*/

// SVG 내부에서 차트가 그려질 세로 영역

// TOP, BOTTOM 좌표값
const CHART_TOP = 20; // 가장 높은 데이터가 찍히는 y좌표
const CHART_BOTTOM = 180; // x축 기준 y좌표

// SVG 내부에서 요일별 점들이 배치될 가로 시작/끝 좌표
const X_START = 28;
const X_END = 392;
// 금액 레이블이 SVG 좌우 끝에서 잘리지 않도록 제한하는 x 좌표 범위
const LABEL_X_MIN = 30;
const LABEL_X_MAX = 390;

interface LineChartProps {
  // 백엔드에서 받아 변환된 요일별 매출 차트 데이터
  weekdaySales: SalesByDays[];
  // 현재 선택된 필터 값들
  district: string;
  dong: string | null;
  quarter: string;
  serviceCode: string | null;

}

// index: 요일 순서, pct: 최대 매출 대비 비율
// SVG 좌표계는 y값이 작을수록 위쪽이므로 CHART_BOTTOM에서 비율만큼 빼서 위치를 계산
function toPoint(index: number, pct: number, itemCount: number) {
  const x = X_START + (index * (X_END - X_START)) / (itemCount - 1);
  const y = CHART_BOTTOM - (pct / 100) * (CHART_BOTTOM - CHART_TOP);
  return { x, y };
}

// value가 min~max 범위를 벗어나지 않도록 보정
// 레이블이 차트 밖으로 삐져나가 잘리는 문제를 막기 위해 사용
function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export default function LineChartPanel({
  weekdaySales,
  district,
  dong,
  quarter,
  serviceCode,

}: LineChartProps) {
  // serviceCode로 목업 업종 목록에서 업종명을 조회
  const serviceName = SERVICES.find((service) => service.code === serviceCode)?.name ?? "";
  if (weekdaySales.length === 0) {
    return (
      <article className="panel" id="weekday">
        <h2>요일별 매출분포 ({serviceName})</h2>
        <p className="suitability-empty">요일별 매출 데이터가 없습니다.</p>
      </article>
    );
  }
  // 백엔드 데이터가 아직 없으면 목업 데이터를 사용해서 차트가 비어 보이지 않게 처리
  const chartData = weekdaySales;
  // 각 요일 데이터를 SVG 좌표로 변환
  const points = chartData.map((d, i) => toPoint(i, d.pct, chartData.length));
  // 점들을 연결하는 라인 path 생성
  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x} ${p.y}`).join(" ");
  // 라인 아래쪽을 채우는 면적 path 생성
  const areaPath = `${linePath} V${CHART_BOTTOM} H${points[0].x} Z`;

  // pct가 가장 높은 요일의 index를 찾아 강조 표시와 '최고' 라벨에 사용
  const peakIndex = chartData.reduce(
    (best, d, i) => (d.pct > chartData[best].pct ? i : best),
    0
  );
  const peakPoint = points[peakIndex];

  return (
    <article className="panel" id="weekday">
      <h2> 요일별 매출분포 ({serviceName})</h2>
      <svg className="line-chart" viewBox="0 0 420 220" role="img" aria-label="요일별 매출분포 라인차트">
        {/* y축/x축 기준선 */}
        <path className="axis" d={`M${X_START} ${CHART_TOP} V${CHART_BOTTOM} H${X_END}`} />

        {/* 라인 아래 영역 채움 */}
        <path className="area" d={areaPath} />

        {/* 요일별 매출 추이를 연결하는 라인 */}
        <path className="line" d={linePath} />
        {/* 각 점 위/아래에 표시되는 금액 레이블 */}
        <g className="sales-labels">
          {points.map((p, i) => (
            <text
              key={`${chartData[i].dayCode}-sales`}
              x={clamp(p.x, LABEL_X_MIN, LABEL_X_MAX)}
              y={i === peakIndex ? p.y + 26 : clamp(p.y - 14, 16, CHART_BOTTOM - 12)}
              textAnchor="middle"
            >
              {chartData[i].salesLabel}
            </text>
          ))}
        </g>
        {/* 각 요일의 데이터 포인트. 최고 매출 요일은 조금 더 크게 표시 */}
        <g className="points">
          {points.map((p, i) => (
            <circle key={chartData[i].dayCode} cx={p.x} cy={p.y} r={i === peakIndex ? 7 : 5} />
          ))}
        </g>
        {/* 최고 매출 요일 표시 */}
        <text x={peakPoint.x - 15} y={peakPoint.y - 14}>
          최고
        </text>
        {/* x축 요일 레이블 */}
        <g className="x-labels">
          {points.map((p, i) => (
            <text key={chartData[i].dayCode} x={p.x - 4} y="207">
              {chartData[i].daysLabel}
            </text>
          ))}
        </g>
      </svg>
    </article>
  );
}
