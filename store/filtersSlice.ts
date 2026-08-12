import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { QUARTERS, type RankingBasis } from "@/lib/mockData";

export interface FiltersState {
  districtName: string | null;
  serviceCode: string | null;
  timeSlot: string | null;
  ageGroup: string | null;
  quarter: string;
  rankingBasis: RankingBasis;
}

const initialState: FiltersState = {
  districtName: null,
  serviceCode: null,
  timeSlot: null,
  ageGroup: null,
  quarter: QUARTERS[QUARTERS.length - 1],
  rankingBasis: "quarter",
};

const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setOnboardingSelection(
      state,
      action: PayloadAction<{
        districtName: string;
        serviceCode: string;
        timeSlot: string | null;
        ageGroup: string | null;
      }>
    ) {
      state.districtName = action.payload.districtName;
      state.serviceCode = action.payload.serviceCode;
      state.timeSlot = action.payload.timeSlot;
      state.ageGroup = action.payload.ageGroup;
    },
    hydrateFromParams(
      state,
      action: PayloadAction<Partial<Omit<FiltersState, "rankingBasis">>>
    ) {
      if (action.payload.districtName) state.districtName = action.payload.districtName;
      if (action.payload.serviceCode !== undefined) state.serviceCode = action.payload.serviceCode;
      if (action.payload.timeSlot !== undefined) state.timeSlot = action.payload.timeSlot;
      if (action.payload.ageGroup !== undefined) state.ageGroup = action.payload.ageGroup;
      if (action.payload.quarter) state.quarter = action.payload.quarter;
    },
    setDistrict(state, action: PayloadAction<string>) {
      state.districtName = action.payload;
    },
    setQuarter(state, action: PayloadAction<string>) {
      state.quarter = action.payload;
    },
    setRankingBasis(state, action: PayloadAction<RankingBasis>) {
      state.rankingBasis = action.payload;
    },
  },
});

export const {
  setOnboardingSelection,
  hydrateFromParams,
  setDistrict,
  setQuarter,
  setRankingBasis,
} = filtersSlice.actions;

export default filtersSlice.reducer;
