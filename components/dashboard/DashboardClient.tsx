"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { hydrateFromParams, setDistrict, setDong, setQuarter, setRankingBasis } from "@/store/filtersSlice";
import { RANKING_BASIS_TABS, TIME_DISTRIBUTION, AGE_DISTRIBUTION, TOP5_INSIGHTS, type RankingBasis } from "@/lib/mockData";
import { getDashboardTotalSales } from "@/lib/dashboardApi";
import Topbar from "./Topbar";
import Sidebar from "./Sidebar";
import BarChartPanel from "./BarChartPanel";
import LineChartPanel from "./LineChartPanel";
import DonutPanel from "./DonutPanel";
import SuitabilityPanel from "./SuitabilityPanel";
import InsightModal from "./InsightModal";
import Chatbot from "@/components/chatbot/Chatbot";

export default function DashboardClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const filters = useAppSelector((s) => s.filters);

  // URL 쿼리스트링을 Redux 상태에 반영하는 초기 복원 작업이 끝났는지 표시하는 플래그 
  // URL에서 값을 읽어 Redux 상태에 넣기 전에는 false, 상태가 업데이트되면 true
  const [hydrated, setHydrated] = useState(false);
  // TOP5 인사이트 카드 클릭 시 열리는 상세 모달의 대상 인덱스
  const [openInsightIndex, setOpenInsightIndex] = useState<number | null>(null);
  // 분기별 총 추정 매출액
  const [totalSalesLabel, setTotalSalesLabel] = useState("-");


  /* 
  useEffect 부분: 리액트 컴포넌트가 화면에 렌더링된 후 API, DOM, 타이머 등 외부 시스템과 동기화할 때 사용
  
  */

  // 온보딩에서 넘어오거나 새로고침했을 때 URL 쿼리스트링을 Redux 필터 상태로 복원한다.
  // 예: /dashboard?districtName=강남구&dongName=대치동&serviceCode=CS100002
  useEffect(() => {
    const districtNameParam = searchParams.get("districtName");
    if (districtNameParam) {
      dispatch(
        hydrateFromParams({
          districtName: districtNameParam, // 온보딩 화면에서 넘어온 자치구명
          dongName: searchParams.get("dongName"),  // 대시보드 화면 또는 채팅창에서 선택한 행정동명
          serviceCode: searchParams.get("serviceCode"), // 온보딩 화면에서 넘어온 업종코드 (업종명 선택 -> mockData.ts에서 업종코드로 매핑)
          timeSlot: searchParams.get("time"), // 온보딩 화면에서 넘어온 시간대 (ex. t0006)
          ageGroup: searchParams.get("age"), // 온보딩 화면에서 넘어온 연령대 (ex. age30)
        })
      );
    }
    setHydrated(true);
  }, []);

  // 필수 조건인 자치구가 없으면 대시보드를 보여주지 않고 루트 페이지로 돌려보낸다.
  useEffect(() => {
    if (hydrated && !filters.districtName) {
      router.replace("/");
    }
  }, [hydrated, filters.districtName, router]);

  // ESC 키로 열려 있는 인사이트 상세 모달을 닫는다.
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpenInsightIndex(null);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  // 분기별 총 추정매출액을 백엔드에서 가져와 화면에 표시
  useEffect(() => {
    // 아직 URL 복원이 안끝났거나, 자치구가 없으면 조회하지 않음
    if (!hydrated || !filters.districtName) return;

    // 분기별 총 추정매출액 조회 요청 함수 호출
    fetchTotalSales();
  }, [hydrated, filters.districtName, filters.dongName, filters.quarter]);

  /* 
    주요 함수 부분
  */


  // 대시보드 필터가 바뀔 때 Redux 상태와 URL 쿼리스트링을 같은 값으로 맞춘다.
  // URL 순서를 districtName -> dongName -> serviceCode -> time -> age로 고정해 공유 가능한 주소를 만든다.
  function replaceDashboardQuery(next: { districtName?: string; dongName?: string | null }) {
    const params = new URLSearchParams();
    const districtName = next.districtName ?? filters.districtName;
    const dongName = next.dongName !== undefined ? next.dongName : filters.dongName;

    if (districtName) params.set("districtName", districtName);
    if (dongName) params.set("dongName", dongName);
    if (filters.serviceCode) params.set("serviceCode", filters.serviceCode);
    if (filters.timeSlot) params.set("time", filters.timeSlot);
    if (filters.ageGroup) params.set("age", filters.ageGroup);

    router.replace(`/dashboard?${params.toString()}`);
  }

  // 자치구가 바뀌면 기존 행정동은 다른 자치구에 속할 수 있으므로 함께 초기화하는 함수
  function handleDistrictNameChange(next: string) {
    dispatch(setDistrict(next));
    dispatch(setDong(""));
    replaceDashboardQuery({ districtName: next, dongName: null });
  }

  // 행정동 선택값을 Redux와 URL의 dongName 쿼리 파라미터에 반영하는 함수
  function handleDongNameChange(next: string) {
    dispatch(setDong(next));
    replaceDashboardQuery({ dongName: next || null });
  }

  // 분기 선택은 현재 화면 상태만 바꾸며 URL에는 반영하지 않는 효과의 함수
  function handleQuarterChange(next: string) {
    dispatch(setQuarter(next));
  }

  // 백엔드에 분기별 총 추정매출액 조회 요청 함수
  async function fetchTotalSales() {
    try {
      const data = await getDashboardTotalSales({
        districtName: filters.districtName!,
        dongName: filters.dongName || null,
        quarter: toQuarterCode(filters.quarter),
      });
      // 화면에 표시할 문자열로 저장
      setTotalSalesLabel(`${data.totalSales.toLocaleString()}원`);

    } catch (error) {
      console.error("총 추정매출액 조회 실패", error);
    }
  }
  // '2026 Q1' -> 20261 숫자로 변환
  function toQuarterCode(quarter: string): number {
    const match = quarter.match(/^(\d{4})\s*Q([1-4])$/);
    if (!match) {
      throw new Error(`Invalid quarter format: ${quarter}`);
    }
    return Number(`${match[1]}${match[2]}`);
  }

  // 사이드바 랭킹 기준을 바꾸고, 해당 차트 섹션으로 스크롤하는 함수
  function handleRankingBasisChange(basis: RankingBasis) {
    dispatch(setRankingBasis(basis));
    const anchor = RANKING_BASIS_TABS.find((t) => t.key === basis)?.anchor;
    if (anchor) {
      document.getElementById(anchor)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  // URL -> Redux 복원이 끝나기 전이거나 자치구가 없으면 빈 화면을 유지한다.
  if (!hydrated || !filters.districtName) {
    return null;
  }

  // 선택된 TOP5 인사이트가 있을 때만 모달에 전달한다.
  const openInsight = openInsightIndex !== null ? TOP5_INSIGHTS[openInsightIndex] : null;

  return (
    <main className="dashboard-shell">
      <Topbar
        district={filters.districtName}
        dong={filters.dongName ?? ""}
        quarter={filters.quarter}
        onDistrictChange={handleDistrictNameChange}
        onDongChange={handleDongNameChange}
        onQuarterChange={handleQuarterChange}
      />

      <div className="dashboard-body">
        <Sidebar
          district={filters.districtName}
          quarter={filters.quarter}
          totalSalesLabel={totalSalesLabel}
          rankingBasis={filters.rankingBasis}
          onRankingBasisChange={handleRankingBasisChange}
          onOpenInsight={setOpenInsightIndex}
        />

        <div className="main-column">
          <section className="content-grid">
            <BarChartPanel />
            <LineChartPanel />
            <DonutPanel id="time" title="시간대별 매출분포" centerLabel="시간대별" data={TIME_DISTRIBUTION} />
            <DonutPanel id="age" title="연령대별 매출분포" centerLabel="연령대" data={AGE_DISTRIBUTION} />
          </section>

          <SuitabilityPanel serviceCode={filters.serviceCode} timeSlot={filters.timeSlot} ageGroup={filters.ageGroup} />
        </div>
      </div>

      <InsightModal
        insight={openInsight}
        district={filters.districtName}
        quarter={filters.quarter}
        onClose={() => setOpenInsightIndex(null)}
      />

      <Chatbot district={filters.districtName} dongName={filters.dongName ?? ""} />
    </main>
  );
}
