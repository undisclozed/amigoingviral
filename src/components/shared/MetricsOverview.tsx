import { MetricCard } from "@/components/MetricCard";
import { MetricChartDialog } from "@/components/MetricChartDialog";
import { Eye, ThumbsUp, MessageCircle, Share2, Bookmark, Users, TrendingUp } from "lucide-react";
import { ViralityScore } from "@/components/ViralityScore";
import type { MetricType } from "@/components/charts/types";

interface MetricsOverviewProps {
  type: 'post' | 'account';
  metrics: {
    views: number;
    likes: number;
    comments: number;
    shares?: number;
    saves?: number;
    engagement: number;
    followers?: number;
  };
  previousPeriodMetrics?: {
    views: number;
    likes: number;
    comments: number;
    shares?: number;
    saves?: number;
    engagement: number;
    followers?: number;
  };
  period?: string;
}

export const MetricsOverview = ({ 
  type, 
  metrics, 
  previousPeriodMetrics,
  period = 'Last 30 days'
}: MetricsOverviewProps) => {
  const calculateChange = (current: number, previous: number) => {
    if (!previous) return 0;
    return ((current - previous) / previous) * 100;
  };

  const getViralityScore = () => {
    const score = type === 'post' 
      ? Math.round((metrics.engagement * 100 + metrics.views / 1000) / 2)
      : Math.round((metrics.engagement * 100 + (metrics.followers || 0) / 1000) / 2);
    
    const avgScore = type === 'post' ? 75 : 70;
    return { score, avgScore };
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Views"
          value={metrics.views.toLocaleString()}
          change={previousPeriodMetrics ? calculateChange(metrics.views, previousPeriodMetrics.views) : undefined}
          period={period}
          icon={<Eye className="h-5 w-5" />}
          metric="views"
        />
        <MetricCard
          title="Likes"
          value={metrics.likes.toLocaleString()}
          change={previousPeriodMetrics ? calculateChange(metrics.likes, previousPeriodMetrics.likes) : undefined}
          period={period}
          icon={<ThumbsUp className="h-5 w-5" />}
          metric="likes"
        />
        <MetricCard
          title="Comments"
          value={metrics.comments.toLocaleString()}
          change={previousPeriodMetrics ? calculateChange(metrics.comments, previousPeriodMetrics.comments) : undefined}
          period={period}
          icon={<MessageCircle className="h-5 w-5" />}
          metric="comments"
        />
        {type === 'post' ? (
          <>
            {metrics.shares !== undefined && (
              <MetricCard
                title="Shares"
                value={metrics.shares.toLocaleString()}
                change={previousPeriodMetrics?.shares ? calculateChange(metrics.shares, previousPeriodMetrics.shares) : undefined}
                period={period}
                icon={<Share2 className="h-5 w-5" />}
                metric="shares"
              />
            )}
            {metrics.saves !== undefined && (
              <MetricCard
                title="Saves"
                value={metrics.saves.toLocaleString()}
                change={previousPeriodMetrics?.saves ? calculateChange(metrics.saves, previousPeriodMetrics.saves) : undefined}
                period={period}
                icon={<Bookmark className="h-5 w-5" />}
                metric="saves"
              />
            )}
          </>
        ) : (
          <>
            {metrics.followers !== undefined && (
              <MetricCard
                title="Followers"
                value={metrics.followers.toLocaleString()}
                change={previousPeriodMetrics?.followers ? calculateChange(metrics.followers, previousPeriodMetrics.followers) : undefined}
                period={period}
                icon={<Users className="h-5 w-5" />}
                metric="followers"
              />
            )}
          </>
        )}
        <MetricCard
          title="Engagement Rate"
          value={`${(metrics.engagement * 100).toFixed(1)}%`}
          change={previousPeriodMetrics ? calculateChange(metrics.engagement, previousPeriodMetrics.engagement) : undefined}
          period={period}
          icon={<TrendingUp className="h-5 w-5" />}
          metric="engagement"
        />
      </div>

      <ViralityScore {...getViralityScore()} />

      {Object.entries(metrics).map(([key, value]) => (
        <MetricChartDialog
          key={key}
          title={key.charAt(0).toUpperCase() + key.slice(1)}
          metric={key as MetricType}
          currentValue={value}
          change={previousPeriodMetrics ? calculateChange(value, previousPeriodMetrics[key as keyof typeof previousPeriodMetrics]) : undefined}
        />
      ))}
    </div>
  );
};