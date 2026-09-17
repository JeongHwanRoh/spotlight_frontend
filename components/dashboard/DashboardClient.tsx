"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  hydrateFromParams,
  setDistrict,
  setDong,
  setQuarter,
  setRankingBasis,
} from "@/store/filtersSlice";

import {
  RANKING_BASIS_TABS,
  SERVICES,
  type RankingBasis,
} from "@/lib/mockData";

import {
  toAgeDonutData,
  toTimeDonutData,
} from "@/lib/dashboardTransforms";

import { useDashboardData } from "@/hooks/useDashboardData";
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

  const [hydrated, setHydrated] = useState(false);
  const [openInsightIndex, setOpenInsightIndex] = useState<number | null>(null);

  // 필터 조건이 준비되면 useDashboardData가 매출 API들을 호출하고,
  // 응답을 화면 표시용 데이터로 변환해 반환한다.
  const {
    totalSalesLabel,
    top5ServiceSales,
    weekdaySales,
    timeSales,
    ageSales,
    sidebarServiceInsights,
  } = useDashboardData({
    hydrated,
    filters,
  });

  const serviceCode = searchParams.get("serviceCode");
  const serviceName = SERVICES.find((service) => service.code === serviceCode)?.name ?? "";
  const openInsight = openInsightIndex !== null ? sidebarServiceInsights[openInsightIndex] ?? null : null;

  /* 
  ==================================================================================================
  [1] useEffect 부분: 리액트 컴포넌트가 화면에 렌더링된 후 API, DOM, 타이머 등 외부 시스템과 동기화할 때 사용
  ** 대시보드 관련 주요 API 및 상태변화 로직은 useDashboardData.ts에 구현 **
  ==================================================================================================
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
          serviceCode: searchParams.get("serviceCode"), // 온보딩 화면에서 넘어온 업종코드
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

  /* 
  ==================================================================================  
  [2] 주요 함수 부분
  ==================================================================================  
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

  // 사이드바 랭킹 기준을 바꾸고, 해당 차트 섹션으로 스크롤하는 함수(실제 사이드바 상태 변경 부분)
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

  /* 
  ==================================================================================  
  [3] html 부분
  ==================================================================================  
  */
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
          dong={filters.dongName ?? ""}
          quarter={filters.quarter}
          totalSalesLabel={totalSalesLabel}
          rankingBasis={filters.rankingBasis}
          serviceCode={filters.serviceCode}
          timeSlot={filters.timeSlot}
          ageGroup={filters.ageGroup}
          sidebarServiceInsights={sidebarServiceInsights}
          onRankingBasisChange={handleRankingBasisChange}
          onOpenInsight={setOpenInsightIndex}
        />

        <div className="main-column">
          <section className="content-grid">
            <BarChartPanel
              district={filters.districtName}
              dong={filters.dongName ?? ""}
              quarter={filters.quarter}
              serviceSalesRanks={top5ServiceSales}
            />
            <LineChartPanel weekdaySales={weekdaySales}
              district={filters.districtName}
              dong={filters.dongName ?? ""}
              quarter={filters.quarter}
              serviceCode={filters.serviceCode} />

            <DonutPanel
              id="time"
              title={`시간대별 매출분포 (${serviceName})`}
              centerLabel="시간대별"
              data={toTimeDonutData(timeSales)}
            />

            <DonutPanel id="age" title={`연령대별 매출분포 (${serviceName})`} centerLabel="연령대" data={toAgeDonutData(ageSales)} />
          </section>

          <SuitabilityPanel
            serviceCode={filters.serviceCode}
            timeSlot={filters.timeSlot}
            ageGroup={filters.ageGroup}
            timeSales={timeSales}
            ageSales={ageSales}
            sidebarServiceInsights={sidebarServiceInsights}
          />
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
