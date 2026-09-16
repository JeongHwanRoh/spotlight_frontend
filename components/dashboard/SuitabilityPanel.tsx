import {
  findAgeGroupByCode,
  findTimeSlotByCode,
  type SalesByAges,
  type SalesByTimes,
} from "@/lib/mockData";
import type { SidebarServiceInsight } from "@/lib/sidebarTransforms";

const LEVEL_LABEL: Record<string, string> = { risk: "위험", warn: "보통", good: "양호" };

interface RankedShare {
  label: string;
  pct: number;
  rank: number;
  total: number;
}

interface SuitabilityPanelProps {
  serviceCode: string | null;
  timeSlot: string | null;
  ageGroup: string | null;
  timeSales: SalesByTimes[];
  ageSales: SalesByAges[];
  sidebarServiceInsights: SidebarServiceInsight[];
}

// DashboardClient에서 받은 실제 시간대별 매출액을 기준으로 비중과 순위를 계산한다.
function rankTimeSlotBySales(code: string | null, timeSales: SalesByTimes[]): RankedShare | null {
  if (!code || timeSales.length === 0) return null;

  const totalSalesAmount = timeSales.reduce((sum, item) => sum + item.salesAmount, 0);
  const sorted = [...timeSales].sort((a, b) => b.salesAmount - a.salesAmount);
  const idx = sorted.findIndex((item) => item.timeCode === code);
  if (idx === -1) return null;

  const item = sorted[idx];
  return {
    label: item.timesLabel,
    pct: totalSalesAmount > 0 ? Math.round((item.salesAmount / totalSalesAmount) * 100) : 0,
    rank: idx + 1,
    total: sorted.length,
  };
}

// DashboardClient에서 받은 실제 연령대별 매출액을 기준으로 비중과 순위를 계산한다.
function rankAgeGroupBySales(code: string | null, ageSales: SalesByAges[]): RankedShare | null {
  if (!code || ageSales.length === 0) return null;

  const totalSalesAmount = ageSales.reduce((sum, item) => sum + item.salesAmount, 0);
  const sorted = [...ageSales].sort((a, b) => b.salesAmount - a.salesAmount);
  const idx = sorted.findIndex((item) => item.ageCode === code);
  if (idx === -1) return null;

  const item = sorted[idx];
  return {
    label: item.ageLabel,
    pct: totalSalesAmount > 0 ? Math.round((item.salesAmount / totalSalesAmount) * 100) : 0,
    rank: idx + 1,
    total: sorted.length,
  };
}

export default function SuitabilityPanel({
  serviceCode,
  timeSlot,
  ageGroup,
  timeSales,
  ageSales,
  sidebarServiceInsights,
}: SuitabilityPanelProps) {
  if (!serviceCode && !timeSlot && !ageGroup) {
    return (
      <section className="suitability-panel">
        <h2>적정성 메시지</h2>
        <p className="suitability-empty">온보딩에서 설정한 조건이 없습니다.</p>
      </section>
    );
  }

  const insight = sidebarServiceInsights.find((item) => item.serviceCode === serviceCode) ?? null;
  const timeInfo = findTimeSlotByCode(timeSlot);
  const ageInfo = findAgeGroupByCode(ageGroup);
  const timeRank = rankTimeSlotBySales(timeSlot, timeSales);
  const ageRank = rankAgeGroupBySales(ageGroup, ageSales);

  return (
    <section className="suitability-panel">
      <h2>적정성 메시지</h2>
      <ul>
        <li>
          <b>업종 위험도</b>
          {insight ? (
            <span>
              선택하신 <strong>{insight.serviceName}</strong>은(는) 현재 <strong>{LEVEL_LABEL[insight.riskLevel]}</strong>{" "}
              등급입니다. {insight.message}
            </span>
          ) : (
            <span>선택한 업종이 현재 TOP5 목록에 없어 위험도 메시지를 표시할 수 없습니다.</span>
          )}
        </li>
        <li>
          <b>시간대 매출 순위</b>
          {timeInfo && timeRank ? (
            <span>
              <strong>{timeInfo.label}</strong>는 전체 {timeRank.total}개 시간대 중 매출 비중 <strong>{timeRank.rank}위</strong>
              ({timeRank.pct}%)입니다.
            </span>
          ) : (
            <span>설정한 주요 영업 시간대가 없어 전체 시간대 데이터를 기준으로 안내합니다.</span>
          )}
        </li>
        <li>
          <b>연령대 매출 비중</b>
          {ageInfo && ageRank ? (
            <span>
              <strong>{ageInfo.label}</strong> 고객 매출 비중은 <strong>{ageRank.pct}%</strong>로 전체 {ageRank.total}개 연령대 중 {ageRank.rank}위입니다.
            </span>
          ) : (
            <span>설정한 타겟 연령대가 없어 전체 연령대 데이터를 기준으로 안내합니다.</span>
          )}
        </li>
      </ul>
    </section>
  );
}