/* 
Redux store 전용 공통 훅 파일: Redux 접근을 위한 인프라성 공통 훅

- useAppDispatch: Redux action을 보낼 때 사용하는 타입 지정된 dispatch hook
- useAppSelector: Redux state를 읽을 때 사용하는 타입 지정된 selector hook

*/

import { useDispatch, useSelector, type TypedUseSelectorHook } from "react-redux";
import type { AppDispatch, RootState } from "./index";

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
