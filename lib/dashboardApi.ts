import { api } from "./api";

/*  
[1] 분기별 총 추정매출액 관련
*/

// 1-1. 총 추정매출액 조회 api에 필요한 파라미터
export interface DashboardTotalSalesParams {
    districtName: string;
    dongName?: string | null;
    quarter: number;
}

// 1-2. 총 추정매출액 조회 api의 응답 타입
export interface DashboardTotalSalesResponse {
    totalSales: number;
}

// 1-3. 총 추정매출액 api 받아오기
export async function getDashboardTotalSales(
    params: DashboardTotalSalesParams
): Promise<DashboardTotalSalesResponse> {
    const res = await api.get<DashboardTotalSalesResponse>("/api/dashboard/totalsales", { params });
    return res.data;
}

/* 
[2] 총 추정매출액 TOP5 업종 추출
*/

// 2-1. 총 추정매출액 TOP5 업종 조회 api에 필요한 파라미터
export interface DashboardServiceSalesParams {
    districtName: string;
    dongName?: string | null;
    quarter: number;
}
// 2-2. 총 추정매출액 TOP5 조회 api의 응답 타입(리스트 형태)
export interface DashboardServiceSalesRankItem {
    serviceCode: string;
    serviceName: string;
    salesAmount: number;
}

export interface DashboardServiceSalesResponse {
    serviceSalesRanks: DashboardServiceSalesRankItem[];
}
// 2-3. 총 추정매출액 TOP5 정보 api 받아오기
export async function getDashboardServiceSalesRank(
    params: DashboardServiceSalesParams
): Promise<DashboardServiceSalesResponse> {
    const res = await api.get<DashboardServiceSalesResponse>("/api/dashboard/topFiveServiceBySales", { params });
    return res.data;
}