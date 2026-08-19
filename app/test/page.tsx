"use client";

import { useEffect, useState } from "react";
import { checkBackendHealth, type HealthResponse } from "@/lib/api";

export default function HealthCheckTest() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function verifyBackendAndDb() {
      try {
        setLoading(true);
        const data = await checkBackendHealth();
        setHealth(data);
      } catch (err: any) {
        console.error("헬스체크 실패:", err);
        setError(err.message || "백엔드 또는 DB 연결에 실패했습니다.");
      } finally {
        setLoading(false);
      }
    }

    verifyBackendAndDb();
  }, []);

  if (loading) return <div>백엔드 및 MySQL 연결 확인 중...</div>;

  if (error) {
    return (
      <div style={{ color: "red", padding: "16px", border: "1px solid red" }}>
        <h3>❌ 연결 실패</h3>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div style={{ color: "black" , padding: "16px", border: "1px solid green" }}>
      <h3>✅ 통신 및 DB 연결 성공</h3>
      <ul>
        <li><strong >API Status:</strong> {health?.status}</li>
        <li><strong>DB Connection:</strong> {health?.db_connection}</li>
        <li><strong>DB Query Result:</strong> {health?.result}</li>
      </ul>
    </div>
  );
}