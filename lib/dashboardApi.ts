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