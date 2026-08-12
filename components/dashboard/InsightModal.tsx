import type { ServiceInsight } from "@/lib/mockData";

const LEVEL_LABEL: Record<string, string> = { risk: "위험", warn: "보통", good: "양호" };

interface InsightModalProps {
  insight: ServiceInsight | null;
  district: string;
  quarter: string;
  onClose: () => void;
}

export default function InsightModal({ insight, district, quarter, onClose }: InsightModalProps) {
  return (
    <div
      className={`modal-overlay ${insight ? "active" : ""}`}
      aria-hidden={!insight}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {insight && (
        <section className="modal-box" role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <header className="modal-header">
            <div>
              <h2 id="modal-title">{insight.name}</h2>
              <p>
                {district} · {quarter}
              </p>
            </div>
            <button className="modal-close" type="button" aria-label="닫기" onClick={onClose}>
              ×
            </button>
          </header>

          <div className="pill-row">
            {insight.pills.map((pill) => (
              <span key={pill.text} className={`pill ${pill.level}`}>
                {pill.text}
              </span>
            ))}
          </div>

          <table className="metric-table">
            <tbody>
              <tr>
                <td>개업률</td>
                <td className="value-good">{insight.open.toFixed(1)}%</td>
              </tr>
              <tr>
                <td>폐업률</td>
                <td className={insight.close > insight.open ? "value-bad" : "value-good"}>
                  {insight.close.toFixed(1)}%
                </td>
              </tr>
              <tr>
                <td>전체 점포 수</td>
                <td>{insight.stores.toLocaleString()}개</td>
              </tr>
              <tr>
                <td>점포당 평균 매출</td>
                <td>{insight.average}</td>
              </tr>
            </tbody>
          </table>

          <p className={`insight-message ${insight.level}`}>{insight.message}</p>
          <p style={{ margin: "10px 0 0", color: "var(--muted)", fontSize: "9px" }}>
            개업률 · 위험도는 {LEVEL_LABEL[insight.level]} 수준으로 표시됩니다. (예시 데이터)
          </p>
        </section>
      )}
    </div>
  );
}
