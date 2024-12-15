import { useAccountMetrics } from "@/hooks/useAccountMetrics";
import { MetricsSkeleton } from "./metrics/MetricsSkeleton";
import { MetricsDisplay } from "./metrics/MetricsDisplay";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const AccountOverview = () => {
  const { data: metrics, isLoading, error } = useAccountMetrics();

  if (isLoading) {
    return <MetricsSkeleton />;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Failed to load account metrics. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  if (!metrics) {
    return (
      <Alert>
        <AlertDescription>
          No metrics available. They will appear here once your account starts gathering data.
        </AlertDescription>
      </Alert>
    );
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