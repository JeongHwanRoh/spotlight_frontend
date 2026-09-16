/*
사이드바용 데이터로 변환하는 함수 모음
*/

import { SidebarServiceRankItem } from "./sidebarApi";
import { formatSalesToEok01 } from "./formatter";
import type { RiskLevel } from "./mockData";

const RISK_LABEL: Record<RiskLevel, string> = { risk: "위험", warn: "보통", good: "양호" };

// 사이드바 TOP5 업종 리스트 및 인사이트 모달에서 함께 사용할 데이터 구조
export interface SidebarServiceInsight {
    serviceCode: string;
    serviceName: string;
    salesAmount: number;
    salesLabel: string; // "123.4억원" 등 화면 표시용
    openRate: number; // 개업률(%)
    closeRate: number; // 폐업률(%)
    totalStoreCnt: number; // 전체 점포 수
    avgSalesPerStore: number; // 점포당 평균 매출 = 총매출액 / 전체점포수
    avgSalesPerStoreLabel: string; // 점포당 평균 매출 화면 표시용
    riskLevel: RiskLevel; // 위험수준 (양호/보통/위험)
    riskLabel: string; // "양호" | "보통" | "위험"
    message: string; // 위험수준 인사이트 메시지
    openRateBarPct: number; // 개업률 관계 바 너비(%) - 개업률/폐업률 중 큰 값 기준 정규화
    closeRateBarPct: number; // 폐업률 관계 바 너비(%) - 개업률/폐업률 중 큰 값 기준 정규화
}

// 개업률/폐업률 관계에 따른 위험수준과 인사이트 메시지 판단
// IF 폐업률<개업률 -> 양호 / IF 개업률<=폐업률<개업률*1.5 -> 보통 / IF 폐업률>=개업률*1.5 -> 위험
function classifyRisk(openRate: number, closeRate: number, totalStoreCnt: number): { level: RiskLevel; message: string } {
    // 모수 부족 분기
    if (totalStoreCnt < 10) {
        return {
            level: "warn",
            message: "점포 수가 적어(10개 미만) 위험도 통계 판단이 제한적입니다."
        }
    }
    // 개업률이 폐업률보다 높은 성장 상권
    if (closeRate < openRate) {
        return {
            level: "good",
            message: "개업률이 폐업률을 웃돌며 상권이 활빌히 성장중입니다."
        };
    }
    // 개업률이 0%인 경우 예외처리
    if (openRate === 0) {
        if (closeRate === 0) {
            return {
                level: "warn",
                message: "신규 개·폐업이 없어 정체된 상권입니다. 시장 수요를 주의 깊게 확인하세요."
            };
        }
        return {
            level: "risk",
            message: "신규 개업은 없고 폐업만 발생하는 침체 상권입니다. 신규 진입을 권장하지 않습니다."
        }
    }

    // 개업률 <=폐업률 < 개업률 * 1.5 (보통/주의)
    if (closeRate < openRate * 1.5) {
        return {
            level: "warn",
            message: "폐업률이 개업률보다 앞서고 있어 창업에 주의가 필요합니다."
        };
    }
    
    // 폐업률 >= 개업률 * 1.5 (고위험)
    const multiplierLabel = openRate > 0 ? `${(closeRate / openRate).toFixed(1)}` : "매우 높은 수준";
    return {
        level: "risk",
        message: `폐업률이 개업률의 ${multiplierLabel}배로 생존이 어려운 포화 상권입니다. 강력한 차별화 전략 없이는 신규 진입을 권장하지 않습니다.`,
    };
}

// 백엔드 응답을 사이드바 TOP5 업종 리스트 + 인사이트 모달 표시용 데이터로 변환
export function toSidebarServiceInsights(items: SidebarServiceRankItem[]): SidebarServiceInsight[] {
    return items.map((item) => {
        const { level, message } = classifyRisk(item.openRate, item.closeRate,item.totalStoreCnt);
        const avgSalesPerStore = item.totalStoreCnt > 0 ? Math.round(item.salesAmount / item.totalStoreCnt) : 0;
        const barMaxRate = Math.max(item.openRate, item.closeRate, 0.0001);

        return {
            serviceCode: item.serviceCode,
            serviceName: item.serviceName,
            salesAmount: item.salesAmount,
            salesLabel: formatSalesToEok01(item.salesAmount),
            openRate: item.openRate,
            closeRate: item.closeRate,
            totalStoreCnt: item.totalStoreCnt,
            avgSalesPerStore,
            avgSalesPerStoreLabel: formatSalesToEok01(avgSalesPerStore),
            riskLevel: level,
            riskLabel: RISK_LABEL[level],
            message,
            openRateBarPct: Math.round((item.openRate / barMaxRate) * 100),
            closeRateBarPct: Math.round((item.closeRate / barMaxRate) * 100),
        };
    });
}
