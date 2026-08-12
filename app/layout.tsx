// layout.tsx: 모든 페이지를 감싸는 공통 레이아웃
// 최초 진입점

import type { Metadata } from "next";
import ReduxProvider from "@/components/providers/ReduxProvider";  // Redux Provider 컴포넌트
import "./globals.css"; // 전역 css import

export const metadata: Metadata = {
  title: "Spotlight",
  description: "상권 데이터 기반 창업 인사이트 대시보드",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ReduxProvider>{children}</ReduxProvider> {/* 이 자리에 최상의 page.tsx가 들어감 */}
      </body>
    </html>
  );
}
