import type { SidebarServiceInsight } from "@/lib/sidebarTransforms";

interface InsightModalProps {
  insight: SidebarServiceInsight | null;
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
              <h2 id="modal-title">{insight.serviceName}</h2>
              <p>
                {district} · {quarter}
              </p>
            </div>
            <button className="modal-close" type="button" aria-label="닫기" onClick={onClose}>
              ×
            </button>
          </header>

          <div className="relation-bar">
            <div className="relation-bar-row">
              <span>개업률 {insight.openRate.toFixed(1)}%</span>
              <div className="relation-bar-track">
                <div className="relation-bar-fill" style={{ width: `${insight.openRateBarPct}%` }} />
              </div>
            </div>
            <div className="relation-bar-row">
              <span>폐업률 {insight.closeRate.toFixed(1)}%</span>
              <div className="relation-bar-track">
                <div
                  className={`relation-bar-fill ${insight.riskLevel}`}
                  style={{ width: `${insight.closeRateBarPct}%` }}
                />
              </div>
            </div>
          </div>

          <table className="metric-table">
            <tbody>
              <tr>
                <td>개업률</td>
                <td className="value-good">{insight.openRate.toFixed(1)}%</td>
              </tr>
              <tr>
                <td>폐업률</td>
                <td className={insight.closeRate > insight.openRate ? "value-bad" : "value-good"}>
                  {insight.closeRate.toFixed(1)}%
                </td>
              </tr>
              <tr>
                <td>전체 점포 수</td>
                <td>{insight.totalStoreCnt.toLocaleString()}개</td>
              </tr>
              <tr>
                <td>점포당 평균 매출</td>
                <td>{insight.avgSalesPerStoreLabel}</td>
              </tr>
            </tbody>
          </table>

          <p className={`insight-message ${insight.riskLevel}`}>{insight.message}</p>
        </section>
      )}
    </div>
  );
}
