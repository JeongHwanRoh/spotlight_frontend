import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { QUARTERS, type RankingBasis } from "@/lib/mockData";

// 대시보드 전역 필터 상태의 타입 정의
// null은 아직 사용자가 값을 선택하지 않았거나 URL 쿼리에 값이 없는 상태를 의미한다.
export interface FiltersState {
  districtName: string | null;  // 서울시 자치구
  dongName: string | null; // 자치구 내 행정동
  serviceCode: string | null; // 업종 코드 
  timeSlot: string | null; // 시간대
  ageGroup: string | null; // 연령 그룹
  quarter: string; // 분기 (EX. 2026 Q1)
  rankingBasis: RankingBasis; // TOP5 업종 및 상권을 어떤 관점으로 볼지? (분기별-quarter, 요일별=weekday, 시간대별-time, 연령대별-age)
}

// Redux store에 처음 등록될 때 사용할 필터 기본값
// 분기는 mockData의 가장 마지막 값을 기본 선택값으로 사용한다.
const initialState: FiltersState = {
  districtName: null,
  dongName: null,
  serviceCode: null,
  timeSlot: null,
  ageGroup: null,
  quarter: QUARTERS[0], 
  rankingBasis: "quarter", // 분기별 TOP5가 디폴트값
};

// filters slice는 필터 상태(initialState), 상태 변경 함수(reducers), 액션 생성 함수를 한 곳에 묶는다.
const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    // 온보딩 폼에서 제출한 조건을 한 번에 Redux 필터 상태로 저장한다.
    // 행정동은 대시보드에서 추가 선택할 수 있으므로 선택값이 없으면 null로 유지한다.
    setOnboardingSelection(
      state,
      action: PayloadAction<{
        districtName: string;
        dongName?: string | null;
        serviceCode: string;
        timeSlot: string | null;
        ageGroup: string | null;
      }>
    ) {
      state.districtName = action.payload.districtName;
      state.dongName = action.payload.dongName ?? null;
      state.serviceCode = action.payload.serviceCode;
      state.timeSlot = action.payload.timeSlot;
      state.ageGroup = action.payload.ageGroup;
    },
    // URL 쿼리스트링에서 읽은 값을 Redux 필터 상태로 복원한다.
    // undefined는 해당 쿼리 자체가 없다는 뜻이므로 기존 값을 유지하고, null은 값이 없음을 저장할 수 있다.
    hydrateFromParams(
      state,
      action: PayloadAction<Partial<Omit<FiltersState, "rankingBasis">>>
    ) {
      if (action.payload.districtName) state.districtName = action.payload.districtName;
      if (action.payload.dongName !== undefined) state.dongName = action.payload.dongName;
      if (action.payload.serviceCode !== undefined) state.serviceCode = action.payload.serviceCode;
      if (action.payload.timeSlot !== undefined) state.timeSlot = action.payload.timeSlot;
      if (action.payload.ageGroup !== undefined) state.ageGroup = action.payload.ageGroup;
      if (action.payload.quarter) state.quarter = action.payload.quarter;
    },
    // 대시보드 상단 필터에서 자치구를 변경할 때 사용한다.
    setDistrict(state, action: PayloadAction<string>) {
      state.districtName = action.payload;
    },
    // 대시보드 상단 필터에서 행정동을 변경할 때 사용한다.
    setDong(state, action: PayloadAction<string>) {
      state.dongName = action.payload;
    },
    // 대시보드 상단 분기 버튼을 변경할 때 사용한다.
    setQuarter(state, action: PayloadAction<string>) {
      state.quarter = action.payload;
    },
    // 사이드바에서 랭킹 기준 탭(분기/요일/시간/연령)을 변경할 때 사용한다.
    setRankingBasis(state, action: PayloadAction<RankingBasis>) {
      state.rankingBasis = action.payload;
    },
  },
});

// 컴포넌트에서 dispatch(setDistrict(...))처럼 호출할 액션 생성 함수들
export const {
  setOnboardingSelection,
  hydrateFromParams,
  setDistrict,
  setDong,
  setQuarter,
  setRankingBasis,
} = filtersSlice.actions;

// store/index.ts에서 root reducer에 등록할 filters reducer
export default filtersSlice.reducer;
