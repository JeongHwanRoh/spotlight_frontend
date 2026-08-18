import axios from "axios";

// FastAPI backend base URL. No business endpoints exist yet -- this client
// is wired up so future dashboard/chatbot API calls only need a new method
// here, and so we can verify CORS is configured correctly between the
// Next.js dev server (8087) and FastAPI (8088).
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8088",
  timeout: 5000,
});

export interface HealthResponse {
  status: string;
  db_connection: string;
  result: number;
}

export async function checkBackendHealth(): Promise<HealthResponse> {
  const res = await api.get<HealthResponse>("/api/health");
  return res.data;
}

