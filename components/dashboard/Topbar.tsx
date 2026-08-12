"use client";

import { DISTRICTS, QUARTERS } from "@/lib/mockData";
import type { BackendStatus } from "@/components/dashboard/DashboardClient";

interface TopBarProps {
  district: string;
  quarter: string;
  backendStatus: BackendStatus;
  onDistrictChange: (district: string) => void;
  onQuarterChange: (quarter: string) => void;
}

const STATUS_LABEL: Record<BackendStatus, string> = {
  checking: "API 확인 중",
  online: "API 연결됨",
  offline: "API 연결 안됨",
};

export default function TopBar({
  district,
  quarter,
  backendStatus,
  onDistrictChange,
  onQuarterChange,
}: TopBarProps) {
  return (
    <header className="topbar">
      <div className="brand-lockup">
        <h1>Spotlight</h1>
        <p>최적의 입지를 밝혀드릴게요</p>
      </div>

      <div className="filters" aria-label="대시보드 필터">
        <span>자치구 선택</span>
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

        <span className={`backend-status ${backendStatus}`}>
          <i className="dot" />
          {STATUS_LABEL[backendStatus]}
        </span>
      </div>
    </header>
  );
}
