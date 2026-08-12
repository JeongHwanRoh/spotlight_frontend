import {
  findInsightByServiceCode,
  findTimeSlotByCode,
  findAgeGroupByCode,
  rankTimeSlot,
  rankAgeGroup,
} from "@/lib/mockData";

const LEVEL_LABEL: Record<string, string> = { risk: "위험", warn: "보통", good: "양호" };

interface SuitabilityPanelProps {
  serviceCode: string | null;
  timeSlot: string | null;
  ageGroup: string | null;
}

export default function SuitabilityPanel({ serviceCode, timeSlot, ageGroup }: SuitabilityPanelProps) {
  if (!serviceCode && !timeSlot && !ageGroup) {
    return (
      <section className="suitability-panel">
        <h2>적정성 메시지</h2>
        <p className="suitability-empty">온보딩에서 설정한 조건이 없습니다.</p>
      </section>
    );
  }

  const insight = findInsightByServiceCode(serviceCode);
  const timeInfo = findTimeSlotByCode(timeSlot);
  const timeRank = rankTimeSlot(timeSlot);
  const ageInfo = findAgeGroupByCode(ageGroup);
  const ageRank = rankAgeGroup(ageGroup);

  return (
    <section className="suitability-panel">
      <h2>적정성 메시지</h2>
      <ul>
        <li>
          <b>업종 위험도</b>
          {insight ? (
            <span>
              선택하신 <strong>{insight.name}</strong>은(는) 현재 <strong>{LEVEL_LABEL[insight.level]}</strong>{" "}
              등급입니다. {insight.message}
            </span>
          ) : (
            <span>선택한 업종에 대한 데이터가 아직 없습니다.</span>
          )}
        </li>
        <li>
          <b>시간대 매출 순위</b>
          {timeInfo && timeRank ? (
            <span>
              <strong>{timeInfo.label}</strong>는 전체 {timeRank.total}개 시간대 중 매출 비중{" "}
              <strong>{timeRank.rank}위</strong>({timeRank.pct}%)입니다.
            </span>
          ) : (
            <span>설정한 주요 영업 시간대가 없어 전체 시간대 데이터를 기준으로 안내합니다.</span>
          )}
        </li>
        <li>
          <b>연령대 매출 비중</b>
          {ageInfo && ageRank ? (
            <span>
              <strong>{ageInfo.label}</strong> 고객 매출 비중은 <strong>{ageRank.pct}%</strong>로 전체{" "}
              {ageRank.total}개 연령대 중 {ageRank.rank}위입니다.
            </span>
          ) : (
            <span>설정한 타겟 연령대가 없어 전체 연령대 데이터를 기준으로 안내합니다.</span>
          )}
        </li>
      </ul>
    </section>
  );
}
