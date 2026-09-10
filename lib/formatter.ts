
   /* 
   금액이나 숫자 포매팅 관련 공통 함수 모음
   */ 

  // 추정매출액 화면조회 단위를 억단위로 끊기 (소수 첫째자리까지)
  export function formatSalesToEok01(totalSales: number) {
    return `${Number((totalSales / 100000000).toFixed(1)).toLocaleString()}억원`;
  }

  // 추정매출액 화면조회 단위를 억단위로 끊기 (소수 둘째자리까지)
  export function formatSalesToEok02(totalSales: number) {
    return `${Number((totalSales / 100000000).toFixed(2)).toLocaleString()}억원`;
  }

  // '2026 Q1' -> 20261 숫자로 변환
  export function toQuarterCode(quarter: string): number {
    const match = quarter.match(/^(\d{4})\s*Q([1-4])$/);
    if (!match) {
      throw new Error(`Invalid quarter format: ${quarter}`);
    }
    return Number(`${match[1]}${match[2]}`);
  }