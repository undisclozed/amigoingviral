import { MetricCard } from "@/components/MetricCard";
import { MetricChartDialog } from "@/components/MetricChartDialog";
import { Eye, ThumbsUp, MessageCircle, Share2, Bookmark, Users, TrendingUp } from "lucide-react";
import { ViralityScore } from "@/components/ViralityScore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  accountHandle?: string;
  profileImage?: string;
}

export const MetricsOverview = ({ 
  type, 
  metrics, 
  previousPeriodMetrics,
  period = 'Last 30 days',
  accountHandle = '@username',
  profileImage
}: MetricsOverviewProps) => {
  const calculateChange = (current: number, previous: number) => {
    if (!previous) return 0;
    return ((current - previous) / previous) * 100;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 mb-6">
        <Avatar className="h-16 w-16">
          <AvatarImage src={profileImage} alt={accountHandle} />
          <AvatarFallback>{accountHandle.slice(1, 3).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-2xl font-semibold">{accountHandle}</h2>
          <p className="text-sm text-gray-500">{period}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
        <MetricCard
          title="Views"
          value={metrics.views.toLocaleString()}
          change={previousPeriodMetrics ? calculateChange(metrics.views, previousPeriodMetrics.views) : undefined}
          icon={<Eye className="h-4 w-4" />}
          metric="views"
        />
        <MetricCard
          title="Likes"
          value={metrics.likes.toLocaleString()}
          change={previousPeriodMetrics ? calculateChange(metrics.likes, previousPeriodMetrics.likes) : undefined}
          icon={<ThumbsUp className="h-4 w-4" />}
          metric="likes"
        />
        <MetricCard
          title="Comments"
          value={metrics.comments.toLocaleString()}
          change={previousPeriodMetrics ? calculateChange(metrics.comments, previousPeriodMetrics.comments) : undefined}
          icon={<MessageCircle className="h-4 w-4" />}
          metric="comments"
        />
        {type === 'post' ? (
          <>
            {metrics.shares !== undefined && (
              <MetricCard
                title="Shares"
                value={metrics.shares.toLocaleString()}
                change={previousPeriodMetrics?.shares ? calculateChange(metrics.shares, previousPeriodMetrics.shares) : undefined}
                icon={<Share2 className="h-4 w-4" />}
                metric="shares"
              />
            )}
            {metrics.saves !== undefined && (
              <MetricCard
                title="Saves"
                value={metrics.saves.toLocaleString()}
                change={previousPeriodMetrics?.saves ? calculateChange(metrics.saves, previousPeriodMetrics.saves) : undefined}
                icon={<Bookmark className="h-4 w-4" />}
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
                icon={<Users className="h-4 w-4" />}
                metric="followers"
              />
            )}
          </>
        )}
        <MetricCard
          title="Engagement"
          value={`${(metrics.engagement * 100).toFixed(1)}%`}
          change={previousPeriodMetrics ? calculateChange(metrics.engagement, previousPeriodMetrics.engagement) : undefined}
          icon={<TrendingUp className="h-4 w-4" />}
          metric="engagement"
        />
      </div>

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