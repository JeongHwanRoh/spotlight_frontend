"use client";

import { RANKING_BASIS_TABS, TOP5_INSIGHTS, type RankingBasis } from "@/lib/mockData";
import { useRouter } from "next/navigation";

const LEVEL_LABEL: Record<string, string> = { risk: "위험", warn: "보통", good: "양호" };

interface SidebarProps {
  district: string;
  dong: string | null;
  quarter: string;
  totalSalesLabel: string;
  rankingBasis: RankingBasis;
  serviceCode: string | null;
  timeSlot: string | null;
  ageGroup: string | null;
  onRankingBasisChange: (basis: RankingBasis) => void;
  onOpenInsight: (index: number) => void;
}

// 시간대별 선택 시 "11시 ~ 14시"라고 조회되게 포맷 변환
// 연령대별 선택 시 "00대"라고 조회되게 포맷 변환 (단 age60p -> 60대 이상)
function formatSelectedRankingLabel(basis: RankingBasis, timeSlot: string | null, ageGroup: string | null) {
  if (basis === "time" && timeSlot) {
    const match = timeSlot.match(/^t(\d{2})(\d{2})$/);
    return match ? `${match[1]}~${match[2]}시` : null;
  }

  if (basis === "age" && ageGroup) {
    const match = ageGroup.match(/^age(\d{2})$/);
    if (match) return `${Number(match[1])}대`;
    if (ageGroup === "age60p") return "60대 이상";
  }

  return null;
}


export default function Sidebar({
  district,
  dong,
  quarter,
  totalSalesLabel,
  rankingBasis,
  serviceCode,
  timeSlot,
  ageGroup,
  onRankingBasisChange,
  onOpenInsight,
}: SidebarProps) {
  const router = useRouter();
  const activeTab = RANKING_BASIS_TABS.find((t) => t.key === rankingBasis) ?? RANKING_BASIS_TABS[0];
  const rankingTitleLabel = formatSelectedRankingLabel(rankingBasis, timeSlot, ageGroup) ?? activeTab.label;

  // onboarding 화면으로 돌아가기
  function goBackToOnboardingPage() {
    router.push("/onboarding");
  }
  // timeSlot(시간대) 또는 ageGroup(연령대)가 null일 경우 업종 순위 출력 안되게 alert 처리
  function handleRankingTabClick(basis: RankingBasis) {
    if (basis == "time" && !timeSlot) {
      alert("온보딩에서 주요 영업 시간대를 선택해주세요")
      pushOnboardingWithCurrentSelection();
      return;
    }
    if (basis == "age" && !ageGroup) {
      alert("온보딩에서 주요 타겟 연령대를 선택해주세요")
      pushOnboardingWithCurrentSelection();
      return;
    }
    onRankingBasisChange(basis);  // 실제로는 부모 컴포넌트에 연결된 handleRankingBasisChange(basis) 함수가 호출되고 실행된다.
  }

  // handleRankingTabClick 함수에서 온보딩 화면으로 이동 시 라우팅 규칙
  function pushOnboardingWithCurrentSelection() {
    const params = new URLSearchParams();
    if (district) params.set("districtName", district); //districtName url 추가
    if (dong) params.set("dongName", dong);  // dongName url 추가
    if (serviceCode) params.set("serviceCode", serviceCode); // serviceCode url 추가
    if (timeSlot) params.set("time", timeSlot); // timeSlot url 추가
    if (ageGroup) params.set("age", ageGroup); // ageGroup url 추가
    router.push(`/onboarding?${params.toString()}`);
  }

  return (
    <aside className="sidebar">
      <section className="summary-card">
        <p> {quarter} 총 매출액</p>
        <strong>{totalSalesLabel}</strong>
        <p>
          {district} {dong}
        </p>
      </section>

      <nav className="metric-tabs" aria-label="TOP5 조회 기준">
        {RANKING_BASIS_TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            className={tab.key === rankingBasis ? "active" : ""}
            onClick={() => handleRankingTabClick(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <section className="ranking-card">
        <h2>{rankingTitleLabel} TOP 5 업종</h2>
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
      <button type="button" className="back-action" onClick={() => goBackToOnboardingPage()}>
        <p>돌아가기</p>
      </button>
    </aside>
  );
}


