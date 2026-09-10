/* 
대시보드 api 호출 함수 모음
*/
import { api } from "./api";

/*  
==================================================================================================
[1] 분기별 총 추정매출액 관련
==================================================================================================
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
==================================================================================================
[2] 총 추정매출액 TOP5 업종 추출
==================================================================================================
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

/* 
==================================================================================================
[3] 요일별 매출액 분포 추출
==================================================================================================
*/

// 3-1. 요일별 매출액 분포 조회 api에 필요한 파라미터
export interface DashboardWeekdaySalesParams {
    districtName: string;
    dongName?: string | null;
    serviceCode: string | null;
    quarter: number;
}

// 3-2. 요일별 매출액 분포 조회 api의 응답 타입(단일 행 형태)
export interface DashboardWeekdaySalesItem {
    monSalesAmount: number;
    tueSalesAmount: number;
    wedSalesAmount: number;
    thuSalesAmount: number;
    friSalesAmount: number;
    satSalesAmount: number;
    sunSalesAmount: number;
}

export interface DashboardWeekdaySalesResponse {
    weekdaySales: DashboardWeekdaySalesItem;
}

// 3-3. 요일별 매출액 분포 정보 api 받아오기
export async function getDashboardWeekdaySales(
    params: DashboardWeekdaySalesParams
): Promise<DashboardWeekdaySalesResponse> {
    const res = await api.get<DashboardWeekdaySalesResponse>("/api/dashboard/weekdaySales", { params });
    return res.data;
}


/* 
==================================================================================================
[4] 시간대별 매출분포 추출
==================================================================================================
*/

// 4-1. 시간대별 매출액 분포 조회 api에 필요한 파라미터
export interface DashboardTimeSalesParams{
    districtName: string;
    dongName?: string | null;
    serviceCode: string | null;
    quarter: number;
}

// 4-2. 시간대별 매출액 분포 조회 api의 응답 타입(단일 행 형태)
export interface DashboardTimeSalesItem{
    t0006SalesAmount: number;
    t0611SalesAmount: number;
    t1114SalesAmount: number;
    t1417SalesAmount: number;
    t1721SalesAmount: number;
    t2124SalesAmount: number;
}

export interface DashboardTimeSalesResponse{
    timeSales:DashboardTimeSalesItem;
}
// 4-3. 시간대별 매출액 분포 정보 api 받아오기
export async function getDashboardTimeSales(
    params:DashboardTimeSalesParams
):Promise<DashboardTimeSalesResponse>{
    const res=await api.get<DashboardTimeSalesResponse>("/api/dashboard/timeSales",{params});
    return res.data;
}


/* 
==================================================================================================
[5] 연령대별 매출분포 추출
==================================================================================================
*/

// 5-1. 연령대별 매출액 분포 조회 api에 필요한 파라미터
export interface DashboardAgeSalesParams{
    // districtName은 필수이고, dongName이 있으면 행정동 기준으로 조회한다.
    districtName: string;
    dongName?: string | null;
    serviceCode: string | null;
    quarter: number;
}

// 5-2. 연령대별 매출액 분포 조회 api의 응답 타입(단일 행 형태)
export interface DashboardAgeSalesItem{
    age10SalesAmount: number;
    age20SalesAmount: number;
    age30SalesAmount: number;
    age40SalesAmount: number;
    age50SalesAmount: number;
    age60pSalesAmount: number;
}

export interface DashboardAgeSalesResponse{
    ageSales:DashboardAgeSalesItem;
}


// 5-3. 연령대별 매출액 분포 정보 api 받아오기
export async function getDashboardAgeSales(
    params:DashboardAgeSalesParams
):Promise<DashboardAgeSalesResponse>{
    const res=await api.get<DashboardAgeSalesResponse>("/api/dashboard/ageSales",{params});
    return res.data;
}
