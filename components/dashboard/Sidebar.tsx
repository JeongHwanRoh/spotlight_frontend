"use client";

import { RANKING_BASIS_TABS, TOP5_INSIGHTS, TOTAL_SALES_LABEL, type RankingBasis } from "@/lib/mockData";

const LEVEL_LABEL: Record<string, string> = { risk: "위험", warn: "보통", good: "양호" };

interface SidebarProps {
  district: string;
  quarter: string;
  rankingBasis: RankingBasis;
  onRankingBasisChange: (basis: RankingBasis) => void;
  onOpenInsight: (index: number) => void;
}

export default function Sidebar({
  district,
  quarter,
  rankingBasis,
  onRankingBasisChange,
  onOpenInsight,
}: SidebarProps) {
  const activeTab = RANKING_BASIS_TABS.find((t) => t.key === rankingBasis) ?? RANKING_BASIS_TABS[0];

  return (
    <aside className="sidebar">
      <section className="summary-card">
        <span>총 추정매출액</span>
        <strong>{TOTAL_SALES_LABEL}</strong>
        <p>
          {district} · {quarter}
        </p>
      </section>

      <nav className="metric-tabs" aria-label="TOP5 조회 기준">
        {RANKING_BASIS_TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            className={tab.key === rankingBasis ? "active" : ""}
            onClick={() => onRankingBasisChange(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <section className="ranking-card">
        <h2>{activeTab.label} TOP 5 업종</h2>
        <ol>
          {TOP5_INSIGHTS.map((insight, index) => (
            <li key={insight.name}>
              <span className="rank">{index + 1}</span>
              <b>{insight.name}</b>
              <em>{insight.quarterSalesLabel}</em>
              <button
                type="button"
                className={`badge ${insight.level}`}
                onClick={() => onOpenInsight(index)}
              >
                {LEVEL_LABEL[insight.level]}
              </button>
            </li>
          ))}
        </ol>
      </section>
    </aside>
  );
}
