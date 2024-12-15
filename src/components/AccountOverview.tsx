import { useAccountMetrics } from "@/hooks/useAccountMetrics";
import { MetricsSkeleton } from "./metrics/MetricsSkeleton";
import { MetricsDisplay } from "./metrics/MetricsDisplay";

export const AccountOverview = () => {
  const { metrics, loading } = useAccountMetrics();

  if (loading) {
    return <MetricsSkeleton />;
  }

  if (!metrics) {
    return null;
  }

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-xl sm:text-2xl font-semibold">Account Overview</h2>
      </div>
      <MetricsDisplay metrics={metrics} />
    </div>
  );
};