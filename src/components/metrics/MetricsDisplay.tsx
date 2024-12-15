import { MetricCard } from "@/components/MetricCard";
import { MetricChartDialog } from "@/components/MetricChartDialog";
import { Users, Eye, Percent, Users2 } from "lucide-react";
import type { AccountMetrics } from "@/types/database";

interface MetricsDisplayProps {
  metrics: AccountMetrics;
}

export const MetricsDisplay = ({ metrics }: MetricsDisplayProps) => {
  const formatMetricValue = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toString();
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div onClick={() => document.getElementById('followers-dialog')?.click()}>
        <MetricCard
          title="Followers"
          value={formatMetricValue(metrics.follower_count)}
          change={metrics.follower_growth}
          subValue={`${metrics.follower_growth > 0 ? '+' : ''}${metrics.follower_growth}% growth`}
          period="Last 30 days"
          icon={<Users className="h-4 w-4" />}
          metric="followers"
        />
        <MetricChartDialog
          title="Followers"
          metric="followers"
          currentValue={metrics.follower_count}
          change={metrics.follower_growth}
        />
      </div>

      <div onClick={() => document.getElementById('reach-dialog')?.click()}>
        <MetricCard
          title="Accounts Reached"
          value={formatMetricValue(metrics.accounts_reached)}
          change={((metrics.accounts_reached - metrics.accounts_engaged) / metrics.accounts_engaged) * 100}
          subValue={`${formatMetricValue(metrics.accounts_engaged)} engaged`}
          period="Last 30 days"
          icon={<Eye className="h-4 w-4" />}
          metric="reach"
        />
        <MetricChartDialog
          title="Reach"
          metric="reach"
          currentValue={metrics.accounts_reached}
          change={((metrics.accounts_reached - metrics.accounts_engaged) / metrics.accounts_engaged) * 100}
        />
      </div>

      <div onClick={() => document.getElementById('engagement-dialog')?.click()}>
        <MetricCard
          title="Avg. Engagement"
          value={`${metrics.avg_engagement_rate.toFixed(1)}%`}
          change={0}
          subValue={`${formatMetricValue(metrics.avg_likes)} avg likes`}
          period="Last 30 days"
          icon={<Percent className="h-4 w-4" />}
          metric="engagement"
        />
        <MetricChartDialog
          title="Engagement Rate"
          metric="engagement"
          currentValue={metrics.avg_engagement_rate}
          change={0}
        />
      </div>

      <div onClick={() => document.getElementById('growth-dialog')?.click()}>
        <MetricCard
          title="Growth Score"
          value={metrics.growth_score.toString()}
          change={0}
          subValue="Based on overall performance"
          period="Last 30 days"
          icon={<Users2 className="h-4 w-4" />}
          metric="growth"
        />
        <MetricChartDialog
          title="Growth Score"
          metric="growth"
          currentValue={metrics.growth_score}
          change={0}
        />
      </div>
    </div>
  );
};