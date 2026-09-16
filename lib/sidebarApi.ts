/*
사이드바 TOP5 업종 api 호출 함수 모음
*/
import { api } from "./api";

/*
==================================================================================================
[1] 사이드바 TOP5 업종 조회 (분기별 · 시간대별 · 연령대별 공통)
==================================================================================================
*/

// 1-1. 사이드바 TOP5 업종 조회 api에 필요한 파라미터
export interface SidebarServiceRankParams {
    districtName: string;
    dongName?: string | null;
    quarter: number;
    rankingBasis: "quarter" | "time" | "age";
    timeCode?: string | null; // rankingBasis가 "time"일 때 필수 (ex. t1114)
    ageCode?: string | null; // rankingBasis가 "age"일 때 필수 (ex. age10, age60p)
}

// 1-2. 사이드바 TOP5 업종 조회 api의 응답 타입(리스트 형태)
export interface SidebarServiceRankItem {
    serviceCode: string;
    serviceName: string;
    salesAmount: number;
    totalStoreCnt: number;
    openRate: number;
    closeRate: number;
}

export interface SidebarServiceRankResponse {
    sidebarServiceRanks: SidebarServiceRankItem[];
}

// 1-3. 사이드바 TOP5 업종 정보 api 받아오기
export async function getSidebarServiceRank(
    params: SidebarServiceRankParams
): Promise<SidebarServiceRankResponse> {
    const res = await api.get<SidebarServiceRankResponse>("/api/dashboard/sidebarServiceRank", { params });
    return res.data;
}
