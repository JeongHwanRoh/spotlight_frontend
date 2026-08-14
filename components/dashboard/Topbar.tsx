"use client";

import { DISTRICTS, DONG_MAP, QUARTERS } from "@/lib/mockData";

interface TopBarProps {
  district: string;
  dong: string;
  quarter: string;
  onDistrictChange: (district: string) => void;
  onDongChange: (dong: string) => void;
  onQuarterChange: (quarter: string) => void;
}

export default function TopBar({
  district,
  dong,
  quarter,
  onDistrictChange,
  onDongChange,
  onQuarterChange,
}: TopBarProps) {
  // 선택된 자치구에 해당하는 행정동 목록 추출
  const dongs = DONG_MAP[district] || [];
  return (
    <header className="topbar">
      <div className="brand-lockup">
        <h1>Spotlight</h1>
        <p>최적의 입지를 밝혀드릴게요</p>
      </div>

      <div className="filters" aria-label="대시보드 필터">
        <span>자치구 선택</span>
        {/* 자치구 선택란 */}
        <select
          aria-label="자치구 선택"
          value={district}
          onChange={(e) => onDistrictChange(e.target.value)}
        >
          {DISTRICTS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
        {/* 선택한 자치구 내 행정동 선택란 */}
        <span>행정동 선택</span>
        <select
          aria-label="행정동 선택"
          value={dong}
          onChange={(e) => onDongChange(e.target.value)}
        >
          {/* 선택되지 않았을 때 표시할 기본 옵션 */}
          <option value="">행정동을 선택하세요</option>

          {/* 또는 단순히 빈 칸으로 두고 싶다면 아래처럼 사용: */}
          {/* <option value=""></option> */}

          {dongs.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>

        {/* 분기선택란 (일단 2026년 1분기 기준으로 가고 2027 Q1은 버튼 형식만 만들어놓음) */}
        {QUARTERS.map((q) => (
          <button
            key={q}
            type="button"
            className={q === quarter ? "active" : ""}
            onClick={() => onQuarterChange(q)}
          >
            {q}
          </button>
        ))}

      </div>
    </header>
  );
}
