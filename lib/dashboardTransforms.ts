/* 
대시보드용 데이터로 변환하는 함수 모음
*/

import { DashboardAgeSalesItem, DashboardServiceSalesRankItem, DashboardTimeSalesItem, DashboardWeekdaySalesItem } from "./dashboardApi";
import { formatSalesToEok01 } from "./formatter";
import { SalesByAges, SalesByDays, SalesByTimes, ServiceSalesRank } from "./mockData";

// 백엔드 응답을 바차트 표시용 데이터로 변환
export function toServiceSalesRanks(items: DashboardServiceSalesRankItem[]): ServiceSalesRank[] {
    const maxSalesAmount = Math.max(...items.map((item) => item.salesAmount), 0);

    return items.map((item) => ({
        serviceCode: item.serviceCode,
        serviceName: item.serviceName,
        salesAmount: item.salesAmount,
        salesLabel: formatSalesToEok01(item.salesAmount),
        barHeightPct: maxSalesAmount > 0 ? Math.max(Math.round((item.salesAmount / maxSalesAmount) * 100), 8) : 0, // 바차트 높이 비율(계산1위가 100이라고 가정)
    }));
}

// 백엔드 응답을 라인차트 표시용 데이터로 변환
export function toWeekdaySales(item: DashboardWeekdaySalesItem): SalesByDays[] {
    const values = [
        { dayCode: "mon", daysLabel: "월", salesAmount: item.monSalesAmount },
        { dayCode: "tue", daysLabel: "화", salesAmount: item.tueSalesAmount },
        { dayCode: "wed", daysLabel: "수", salesAmount: item.wedSalesAmount },
        { dayCode: "thu", daysLabel: "목", salesAmount: item.thuSalesAmount },
        { dayCode: "fri", daysLabel: "금", salesAmount: item.friSalesAmount },
        { dayCode: "sat", daysLabel: "토", salesAmount: item.satSalesAmount },
        { dayCode: "sun", daysLabel: "일", salesAmount: item.sunSalesAmount },
    ] as const;

    const maxSalesAmount = Math.max(...values.map((item) => item.salesAmount), 0);

    return values.map((item) => ({
        ...item,
        salesLabel: formatSalesToEok01(item.salesAmount),
        pct: maxSalesAmount > 0 ? Math.round((item.salesAmount / maxSalesAmount) * 100) : 0,
    }));
}

// 백엔드 응답을 도넛차트 표시용 데이터로 변환
export function toTimeSales(item: DashboardTimeSalesItem): SalesByTimes[] {
    const values = [
        { timeCode: "t0006", timesLabel: "00-06시", salesAmount: item.t0006SalesAmount },
        { timeCode: "t0611", timesLabel: "06-11시", salesAmount: item.t0611SalesAmount },
        { timeCode: "t1114", timesLabel: "11-14시", salesAmount: item.t1114SalesAmount },
        { timeCode: "t1417", timesLabel: "14-17시", salesAmount: item.t1417SalesAmount },
        { timeCode: "t1721", timesLabel: "17-21시", salesAmount: item.t1721SalesAmount },
        { timeCode: "t2124", timesLabel: "21-24시", salesAmount: item.t2124SalesAmount },
    ] as const;

    // const maxSalesAmount = Math.max(...values.map((item) => item.salesAmount), 0);

    return values.map((item) => ({
        ...item,
        salesLabel: formatSalesToEok01(item.salesAmount),

    }));
}

  const TIME_COLORS = ["#2354d9", "#2f68ed", "#3d82f2", "#64a6ee", "#9ac8f4", "#c4defb"];

  export function toTimeDonutData(items: SalesByTimes[]) {
    const totalSalesAmount = items.reduce((sum, item) => sum + item.salesAmount, 0);

    return items.map((item, index) => ({
      code: item.timeCode,
      label: item.timesLabel, // 시간대 레이블
      pct: totalSalesAmount > 0 ? Math.round((item.salesAmount / totalSalesAmount) * 100) : 0, // 시간대별 매출점유율
      color: TIME_COLORS[index],
      tooltipLabel: item.salesLabel,
    }));
  }

  // 백엔드 응답을 원형차트 표시용 데이터로 변환
  export function toAgeSales(item: DashboardAgeSalesItem): SalesByAges[] {
    // 백엔드의 age10SalesAmount 같은 컬럼형 응답을 프런트에서 다루기 쉬운 배열로 바꾼다.
    const values = [
      { ageCode: "age10", ageLabel: "10대", salesAmount: item.age10SalesAmount },
      { ageCode: "age20", ageLabel: "20대", salesAmount: item.age20SalesAmount },
      { ageCode: "age30", ageLabel: "30대", salesAmount: item.age30SalesAmount },
      { ageCode: "age40", ageLabel: "40대", salesAmount: item.age40SalesAmount },
      { ageCode: "age50", ageLabel: "50대", salesAmount: item.age50SalesAmount },
      { ageCode: "age60p", ageLabel: "60대 이상", salesAmount: item.age60pSalesAmount },
    ] as const;

    return values.map((item) => ({
      ...item,
      salesLabel: formatSalesToEok01(item.salesAmount),

    }));
  }

  // 연령대별 매출분포 도넛차트 관련
  const AGE_COLORS = ["#2354d9", "#2867e6", "#347ef0", "#60a5fa", "#93c5fd", "#bfdbfe"];

  export function toAgeDonutData(items: SalesByAges[]) {
    const totalSalesAmount = items.reduce((sum, item) => sum + item.salesAmount, 0);

    // 도넛은 pct로 조각 크기를 그리고, tooltipLabel로 실제 매출액을 보여준다.
    return items.map((item, index) => ({
      code: item.ageCode,
      label: item.ageLabel,
      pct: totalSalesAmount > 0 ? Math.round((item.salesAmount / totalSalesAmount) * 100) : 0,
      color: AGE_COLORS[index],
      tooltipLabel: item.salesLabel,
    }));
  }
