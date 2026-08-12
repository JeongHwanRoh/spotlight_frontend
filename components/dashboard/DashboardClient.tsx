"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { hydrateFromParams, setDistrict, setQuarter, setRankingBasis } from "@/store/filtersSlice";
import { checkBackendHealth } from "@/lib/api";
import { RANKING_BASIS_TABS, TIME_DISTRIBUTION, AGE_DISTRIBUTION, TOP5_INSIGHTS, type RankingBasis } from "@/lib/mockData";
import Topbar from "./Topbar";
import Sidebar from "./Sidebar";
import BarChartPanel from "./BarChartPanel";
import LineChartPanel from "./LineChartPanel";
import DonutPanel from "./DonutPanel";
import SuitabilityPanel from "./SuitabilityPanel";
import InsightModal from "./InsightModal";
import Chatbot from "@/components/chatbot/Chatbot";

export type BackendStatus = "checking" | "online" | "offline";

export default function DashboardClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const filters = useAppSelector((s) => s.filters);

  const [hydrated, setHydrated] = useState(false);
  const [openInsightIndex, setOpenInsightIndex] = useState<number | null>(null);
  const [backendStatus, setBackendStatus] = useState<BackendStatus>("checking");

  // 온보딩에서 넘어온(또는 새로고침 시) URL 쿼리스트링을 최초 1회 Redux로 하이드레이션한다.
  // 백엔드 DB에는 이 필터 상태를 저장하지 않고 URL만으로 공유 가능하게 유지한다.
  useEffect(() => {
    const districtNameParam = searchParams.get("districtName");
    if (districtNameParam) {
      dispatch(
        hydrateFromParams({
          districtName: districtNameParam,
          serviceCode: searchParams.get("serviceCode"),
          timeSlot: searchParams.get("time"),
          ageGroup: searchParams.get("age"),
        })
      );
    }
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (hydrated && !filters.districtName) {
      router.replace("/");
    }
  }, [hydrated, filters.districtName, router]);

  useEffect(() => {
    checkBackendHealth()
      .then(() => setBackendStatus("online"))
      .catch(() => setBackendStatus("offline"));
  }, []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpenInsightIndex(null);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  function handleDistrictNameChange(next: string) {
    dispatch(setDistrict(next));
    const params = new URLSearchParams(searchParams.toString());
    params.set("districtName", next);
    router.replace(`/dashboard?${params.toString()}`);
  }

  function handleQuarterChange(next: string) {
    dispatch(setQuarter(next));
  }

  function handleRankingBasisChange(basis: RankingBasis) {
    dispatch(setRankingBasis(basis));
    const anchor = RANKING_BASIS_TABS.find((t) => t.key === basis)?.anchor;
    if (anchor) {
      document.getElementById(anchor)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  if (!hydrated || !filters.districtName) {
    return null;
  }

  const openInsight = openInsightIndex !== null ? TOP5_INSIGHTS[openInsightIndex] : null;

  return (
    <main className="dashboard-shell">
      <Topbar
        district={filters.districtName}
        quarter={filters.quarter}
        backendStatus={backendStatus}
        onDistrictChange={handleDistrictNameChange}
        onQuarterChange={handleQuarterChange}
      />

      <div className="dashboard-body">
        <Sidebar
          district={filters.districtName}
          quarter={filters.quarter}
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

      <Chatbot district={filters.districtName} />
    </main>
  );
}
