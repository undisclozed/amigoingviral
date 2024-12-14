import { MetricCard } from "@/components/MetricCard";
import { MetricChartDialog } from "@/components/MetricChartDialog";
import { getMetricsData } from "./metrics/metricsData";

export const AccountOverview = () => {
  const metrics = getMetricsData();

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-xl sm:text-2xl font-semibold">Account Overview</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <div key={metric.id} onClick={() => document.getElementById(`${metric.id}-dialog`)?.click()}>
            <MetricCard
              title={metric.title}
              value={metric.value}
              change={metric.change}
              subValue={metric.subValue}
              period={metric.period}
              icon={<metric.icon className="h-4 w-4" />}
              metric={metric.metric}
            />
            <MetricChartDialog
              title={metric.title}
              metric={metric.metric}
              currentValue={metric.value}
              change={metric.change}
            />
          </div>
        ))}
      </div>
    </div>
  );
};