"use client";


// Provider 컴포넌트로 React 컴포넌트를 감싸줌으로써
// 하위 컴포넌트들이 Provider를 통해 Redux의 store에 access(접근)할 수 있게 해주는 역할

import { useRef } from "react"; // Redux 저장소를 컴포넌트 리렌더링 사이에서도 계속 보관하는 역할
import { Provider } from "react-redux"; // React Redux의 Provider 컴포넌트
import { makeStore, type AppStore } from "@/store"; // Redux 저장소를 만드는 역할

export default function ReduxProvider({ children }: { children: React.ReactNode }) {
  // Next.js App Router에서는 컴포넌트가 다시 렌더링될 수 있으므로,
  // useRef에 store를 저장해 같은 브라우저 세션 안에서 Redux store 인스턴스를 한 번만 만든다.
  const storeRef = useRef<AppStore | null>(null);
  if (!storeRef.current) {
    storeRef.current = makeStore();
  }
  // Provider 컴포넌트로 store를 이용할 하위 컴포넌트를 감싸면,
  // children 내부 어디서든 useAppDispatch/useAppSelector을 통해 Redux store에 접근할 수 있다.
  return <Provider store={storeRef.current}>{children}</Provider>; 
}
