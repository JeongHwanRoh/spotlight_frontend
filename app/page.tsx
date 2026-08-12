import { redirect } from "next/navigation";

// 루트 경로의 페이지
// localhost:8087 로 최초 접속
// 이후 아래 로직에 따라 자동으로 /onboarding으로 리다이렉트 이동
// localhost:8087/onboarding으로 최초 접속하게 됨.
export default function HomePage() {
  redirect("/onboarding");
}