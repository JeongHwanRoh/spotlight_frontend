/* 
state(상태) + fetch함수(api호출) + effect를  한 묶음으로 custom hook으로 모은 파일
*/
import { useEffect, useState } from "react";
import { getDashboardAgeSales, getDashboardServiceSalesRank, getDashboardTimeSales, getDashboardTotalSales, getDashboardWeekdaySales } from "@/lib/dashboardApi";
import { toAgeSales, toServiceSalesRanks, toTimeSales, toWeekdaySales } from "@/lib/dashboardTransforms"
import { formatSalesToEok01, toQuarterCode } from "@/lib/formatter"
import type {
    SalesByAges,
    SalesByDays,
    SalesByTimes,
    ServiceSalesRank,
} from "@/lib/mockData";
import type { FiltersState } from "@/store/filtersSlice";
import { getSidebarServiceRank } from "@/lib/sidebarApi";
import { toSidebarServiceInsights, type SidebarServiceInsight } from "@/lib/sidebarTransforms";

type DashboardFilters = Pick<
    FiltersState,
    "districtName" | "dongName" | "serviceCode" | "quarter" | "rankingBasis" | "timeSlot" | "ageGroup"
>;
type UseDashboardDataParams = {
    hydrated: boolean;
    filters: DashboardFilters;
};

export function useDashboardData({ hydrated, filters }:
    UseDashboardDataParams
) {
    /* 
    ==================================================================================================
     [1] 대시보드 관련 주요 state(상태) 초기값 모음
    ==================================================================================================
     */
    // 분기별 총 추정 매출액
    const [totalSalesLabel, setTotalSalesLabel] = useState("-");
    // 총 추정매출액 TOP5 업종 목록
    const [top5ServiceSales, setTop5ServiceSales] = useState<ServiceSalesRank[]>([]);
    // 요일별 매출액
    const [weekdaySales, setWeekdaySales] = useState<SalesByDays[]>([]);
    // 시간대별 매출액
    const [timeSales, setTimeSales] = useState<SalesByTimes[]>([]);
    // 연령대별 매출액
    const [ageSales, setAgeSales] = useState<SalesByAges[]>([]);
    // 사이드바 관련 데이터
    const [sidebarServiceInsights, setSidebarServiceInsights] = useState<SidebarServiceInsight[]>([]);

    /* 
    ==================================================================================================
    [2] useEffect 부분: 리액트 컴포넌트가 화면에 렌더링된 후 API, DOM, 타이머 등 외부 시스템과 동기화할 때 사용
    ==================================================================================================
    */


    // 분기별 총 추정매출액을 백엔드에서 가져와 화면에 표시
    useEffect(() => {
        // 아직 URL 복원이 안끝났거나, 자치구가 없으면 조회하지 않음
        if (!hydrated || !filters.districtName) return;

        // 분기별 총 추정매출액 조회 요청 함수 호출
        fetchTotalSales();
    }, [hydrated, filters.districtName, filters.dongName, filters.quarter]);

    // 대시보드 TOP5 업종 매출 순위 가져오기(바차트용)
    useEffect(() => {
        // 아직 URL 복원이 안끝났거나, 자치구가 없으면 조회하지 않음
        if (!hydrated || !filters.districtName) return;

        fetchServiceSalesRank();
    }, [hydrated, filters.districtName, filters.dongName, filters.quarter]);

    // 대시보드 요일별 매출분포 가져오기(라인차트용)
    useEffect(() => {
        if (!hydrated || !filters.districtName) return;

        fetchWeekdaySales();
    }, [hydrated, filters.districtName, filters.dongName, filters.serviceCode, filters.quarter]);

    // 대시보드 시간대별 매출분포 가져오기(도넛차트)
    useEffect(() => {
        if (!hydrated || !filters.districtName) return;

        fetchTimeSales();
    }, [hydrated, filters.districtName, filters.dongName, filters.serviceCode, filters.quarter]);

    // 대시보드 연령대별 매출분포 가져오기(도넛차트)
    useEffect(() => {
        if (!hydrated || !filters.districtName) return;

        fetchAgeSales();
    }, [hydrated, filters.districtName, filters.dongName, filters.serviceCode, filters.quarter]);

    // 사이드바 분기별/시간대별/연령대별 TOP5 업종 및 개폐업률 정보 가져오기
    useEffect(() => {
        if (!hydrated || !filters.districtName) return;
        const basis = filters.rankingBasis;
        if (basis === "time" && !filters.timeSlot) return;
        if (basis === "age" && !filters.ageGroup) return;

        fetchSidebarServiceRank();
    }, [hydrated, filters.districtName, filters.dongName, filters.quarter, filters.rankingBasis, filters.timeSlot, filters.ageGroup])

    /* 
    ==================================================================================================
    [3] api 호출 fetch함수 모음
    ==================================================================================================
    */
    // 백엔드에 분기별 총 추정매출액 조회 요청 함수
    async function fetchTotalSales() {
        try {
            const data = await getDashboardTotalSales({
                districtName: filters.districtName!,
                dongName: filters.dongName || null,
                quarter: toQuarterCode(filters.quarter),
            });
            // 화면에 표시할 문자열로 저장
            setTotalSalesLabel(formatSalesToEok01(data.totalSales));

        } catch (error) {
            console.error("총 추정매출액 조회 실패", error);
        }
    }

    // 백엔드에 총 추정매출액 TOP5 업종 조회 요청 함수
    // 순서: TOP5 업종 가져오는 API 요청및응답  -> 바차트 표시용 데이터 변환 -> 총 추정매출액 TOP5 업종 목록 상태 변환 -> 바차트에 표시
    async function fetchServiceSalesRank() {
        if (!filters.districtName) return;

        try {
            const data = await getDashboardServiceSalesRank({
                districtName: filters.districtName,
                dongName: filters.dongName || null,
                quarter: toQuarterCode(filters.quarter)

            });

            setTop5ServiceSales(toServiceSalesRanks(data.serviceSalesRanks));
        } catch (error) {
            console.error("총 추정매출액 TOP5 업종 조회 실패", error)
        }

    }

    // 백엔드에 요일별 매출분포 조회 요청 함수
    async function fetchWeekdaySales() {
        if (!filters.districtName) return;

        try {
            const data = await getDashboardWeekdaySales({
                districtName: filters.districtName,
                dongName: filters.dongName || null,
                serviceCode: filters.serviceCode,
                quarter: toQuarterCode(filters.quarter)

            });

            setWeekdaySales(toWeekdaySales(data.weekdaySales));
        } catch (error) {
            console.error("요일별 매출분포 조회 실패", error)
        }
    }

    // 백엔드에 시간대별 매출분포 조회 요청 함수
    async function fetchTimeSales() {
        if (!filters.districtName) return;

        try {
            const data = await getDashboardTimeSales({
                districtName: filters.districtName,
                dongName: filters.dongName || null,
                serviceCode: filters.serviceCode,
                quarter: toQuarterCode(filters.quarter)

            });
            console.log("시간대별 매출" + data.timeSales);
            setTimeSales(toTimeSales(data.timeSales));


        } catch (error) {
            console.error("시간대별 매출분포 조회 실패", error)
        }

    }

    // 백엔드에 연령대별 매출분포 조회 요청 함수
    async function fetchAgeSales() {
        if (!filters.districtName) return;

        try {
            const data = await getDashboardAgeSales({
                districtName: filters.districtName,
                dongName: filters.dongName || null,
                serviceCode: filters.serviceCode,
                quarter: toQuarterCode(filters.quarter)

            });
            setAgeSales(toAgeSales(data.ageSales));


        } catch (error) {
            console.error("연령대별 매출분포 조회 실패", error)
        }

    }


    // 사이드바 랭킹 기준(분기별/시간대별/연령대별)이 바뀔 때마다 TOP5 업종 + 위험수준 정보를 백엔드에서 가져온다.
    async function fetchSidebarServiceRank() {
        const basis = filters.rankingBasis;

        try {
            const data = await getSidebarServiceRank({
                districtName: filters.districtName!,
                dongName: filters.dongName || null,
                quarter: toQuarterCode(filters.quarter),
                rankingBasis: basis,
                timeCode: basis === "time" ? filters.timeSlot : null,
                ageCode: basis === "age" ? filters.ageGroup : null,
            });
            setSidebarServiceInsights(toSidebarServiceInsights(data.sidebarServiceRanks));
        } catch (error) {
            console.error("사이드바 TOP5 업종 조회 실패", error);
        }
    }
    return {
        totalSalesLabel,
        top5ServiceSales,
        weekdaySales,
        timeSales,
        ageSales,
        sidebarServiceInsights,
    };

}
