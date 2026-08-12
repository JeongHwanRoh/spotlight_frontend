import { TOP5_INSIGHTS } from "@/lib/mockData";

export default function BarChartPanel() {
  return (
    <article className="panel" id="quarter">
      <h2>분기 매출금액 TOP 5 업종</h2>
      <div className="bar-chart" aria-label="분기 매출금액 TOP 5 업종 막대그래프">
        {TOP5_INSIGHTS.map((insight) => (
          <div key={insight.name} className="bar-item" style={{ ["--h" as string]: `${insight.barHeightPct}%` }}>
            <span>{insight.quarterSalesLabel}</span>
            <i />
            <small>{insight.name}</small>
          </div>
        ))}
      </div>
    </article>
  );
}
