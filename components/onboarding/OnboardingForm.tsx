"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/store/hooks";
import { setOnboardingSelection } from "@/store/filtersSlice";
import { DISTRICTS, SERVICES, TIME_SLOTS, AGE_GROUPS } from "@/lib/mockData";

export default function OnboardingForm() {
  const router = useRouter(); // useRouter() : Client Components 내 프로그래밍 방식으로 라우트 변경
  const dispatch = useAppDispatch(); // useAppDispatch() : Redux store에 action을 보내기 위한 용도
  
  // useState() : 상태 및 생명주기 관리 기능
  const [districtName, setDistrictName] = useState(""); // 자치구명 (백엔드-DB에 필터링 기준으로 활용 예정)
  const[dongName, setDongName]=useState("");
  const [serviceCode, setServiceCode] = useState(""); // 업종 코드 (백엔드-DB에 참조용으로 활용 예정)
  const [timeSlot, setTimeSlot] = useState(""); // 선택한 시간대 (해당 시간대의 추정매출액이나 매출건수와 연결될 예정)
  const [ageGroup, setAgeGroup] = useState(""); // 선택한 연령대 (해당 연령대의 추정매출액이나 매출건수로 연결될 예정)

  const canSubmit = districtName !== "" && serviceCode !== ""; // 자치구명, 업종코드를 모두 입력했을 때 true

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setDistrictName(params.get("districtName") ?? "");
    setDongName(params.get("dongName") ?? "");
    setServiceCode(params.get("serviceCode") ?? "");
    setTimeSlot(params.get("time") ?? "");
    setAgeGroup(params.get("age") ?? "");
  }, []);

  function handleSubmit() {
    if (!canSubmit) return; // 자치구명, 업종코드 미선택시 제출이 안됨

    // setOnboardingSelection: "이 값으로 필터 상태를 바꿔달라" 라는 action을 만드는 역할
    // dispatch: 해당 action을 Redux store로 보냄.
    dispatch(
      setOnboardingSelection({
        districtName,
        dongName: dongName || null,
        serviceCode,
        timeSlot: timeSlot || null,
        ageGroup: ageGroup || null,
      })
    );

    const params = new URLSearchParams({ districtName, dongName, serviceCode });
    if (timeSlot) params.set("time", timeSlot);  // 시간대 입력 시 url에 time으로 추가
    if (ageGroup) params.set("age", ageGroup); // 연령대 입력 시 url에 age로 추가

    // ex) 자치구="마포구", 업종="한식음식점" , 주요영업시간대="00-06시", 주요타겟연령대=30대
    // => http://localhost:8087/dashboard?districtName=마포구&serviceCode=CS100001&time=t0006&age=age30
    
    router.push(`/dashboard?${params.toString()}`);
  }

  return (
    <main className="onboarding-page" aria-label="Spotlight 창업 조건 설정">
      <section className="onboarding-card">
        <header className="brand-header">
          <h1>Spotlight</h1>
          <p>분석할 상권 조건을 선택하면 맞춤 인사이트를 드릴게요</p>
        </header>

        <div className="condition-panel">
          <h2> 창업 조건 설정</h2>

          <label className="field">
            <span>창업 예정 자치구</span>
            <select
              aria-label="창업 예정 자치구"
              value={districtName}
              onChange={(e) => setDistrictName(e.target.value)}
            >
              <option value="">선택해주세요</option>
              {DISTRICTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span>창업 예정 업종</span>
            <select
              aria-label="창업 예정 업종"
              value={serviceCode}
              onChange={(e) => setServiceCode(e.target.value)}
            >
              <option value="">선택해주세요</option>
              {SERVICES.map((s) => (
                <option key={s.code} value={s.code}>
                  {s.name}
                </option>
              ))}
            </select>
          </label>

          <div className="field-grid">
            <label className="field">
              <span>주요 영업 시간대</span>
              <select
                aria-label="주요 영업 시간대"
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
              >
                <option value="">무관</option>
                {TIME_SLOTS.map((t) => (
                  <option key={t.code} value={t.code}>
                    {t.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="field">
              <span>주요 타겟 연령대</span>
              <select
                aria-label="주요 타겟 연령대"
                value={ageGroup}
                onChange={(e) => setAgeGroup(e.target.value)}
              >
                <option value="">무관</option>
                {AGE_GROUPS.map((a) => (
                  <option key={a.code} value={a.code}>
                    {a.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <button
            type="button"
            className="primary-action"
            disabled={!canSubmit}
            onClick={handleSubmit}
          >
            대시보드 보기 <span aria-hidden="true">→</span>
          </button>
        </div>
      </section>
    </main>
  );
}
