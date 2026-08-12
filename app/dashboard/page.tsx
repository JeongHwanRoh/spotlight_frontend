import { Suspense } from "react";
import DashboardClient from "@/components/dashboard/DashboardClient";

// localhost:8087/dashboard 경로에서 대시보드 화면을 보여줌.
export default function DashboardPage() {
  return (
    <Suspense fallback={null}>
      <DashboardClient />
    </Suspense>
  );
}
