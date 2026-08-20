import { type ServiceSalesRank } from "@/lib/mockData";

interface BarChartProps {
  district: string;
  dong: string | null;
  quarter: string;
  serviceSalesRanks: ServiceSalesRank[];

}

export default function BarChartPanel({
  district,
  dong,
  quarter,
  serviceSalesRanks,
}: BarChartProps) {

  return (
    <article className="panel" id="quarter">
      <h2>분기 매출금액 TOP 5 업종</h2>
      <div className="bar-chart" aria-label="분기 매출금액 TOP 5 업종 막대그래프">
        {serviceSalesRanks.map((service) => (
          <div key={service.serviceCode} className="bar-item" style={{ ["--h" as string]: `${service.barHeightPct}%` }}>
            <span>{service.salesLabel}</span>
            <i />
            <small>{service.serviceName}</small>
          </div>
        ))}
      </div>
    </article>
  );
}

