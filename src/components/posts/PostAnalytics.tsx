import { Card } from "@/components/ui/card";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState, useEffect } from "react";
import { getTimeSincePost, getUpdateInterval } from "@/utils/timeUtils";
import { ViralityScore } from "../ViralityScore";
import { PostMetricsTiles } from "./metrics/PostMetricsTiles";
import { PostRatioMetrics } from "./metrics/PostRatioMetrics";
import { PostPerformanceCharts } from "./charts/PostPerformanceCharts";
import { LineChart } from "@/components/LineChart";
import { PostAnalyticsSkeleton } from "./loading/PostAnalyticsSkeleton";
import { PostAnalyticsError } from "./error/PostAnalyticsError";
import type { PostAnalyticsData } from "./types/analytics";
import { toast } from "sonner";

interface PostAnalyticsProps {
  post: PostAnalyticsData;
  onRetry?: () => void;
}

export const PostAnalytics = ({ post, onRetry }: PostAnalyticsProps) => {
  const [updateInterval, setUpdateInterval] = useState<number>(5);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const interval = getUpdateInterval(post.timestamp);
    setUpdateInterval(interval);

    const fetchLatestMetrics = async () => {
      try {
        setIsLoading(true);
        // Simulated API call - replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (Math.random() > 0.9) {
          throw new Error("Failed to fetch latest metrics");
        }

        setError(null);
      } catch (err) {
        setError(err as Error);
        toast.error("Failed to update metrics");
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setInterval(fetchLatestMetrics, interval * 60 * 1000);
    fetchLatestMetrics();

    return () => clearInterval(timer);
  }, [post.timestamp]);

  if (error) {
    return <PostAnalyticsError error={error} onRetry={onRetry || (() => window.location.reload())} />;
  }

  if (isLoading && !post) {
    return <PostAnalyticsSkeleton data-testid="post-analytics-skeleton" />;
  }

  const viralityScore = Math.round((post.metrics.engagement * 100) + 
    (post.metrics.views / 1000) + 
    (post.metrics.likes / 100));
  const avgScore = Math.round(viralityScore * 0.8);

  const getChangeFromAverage = (value: number, average: number) => {
    return ((value - average) / average) * 100;
  };

  const averageMetrics = {
    views: post.metrics.views * 0.8,
    likes: post.metrics.likes * 0.8,
    comments: post.metrics.comments * 0.8,
    shares: post.metrics.shares * 0.8,
    saves: post.metrics.saves * 0.8,
    engagement: post.metrics.engagement * 0.8,
    followsFromPost: post.metrics.followsFromPost * 0.8,
    averageWatchPercentage: post.metrics.averageWatchPercentage * 0.8,
  };

  return (
    <div className="space-y-4" role="region" aria-label="Post Analytics Dashboard">
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <img 
              src={post.thumbnail} 
              alt={`Thumbnail for ${post.caption}`} 
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div>
              <h2 className="text-lg font-semibold">Post Performance</h2>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Info className="h-4 w-4" aria-hidden="true" />
                <span>Posted {getTimeSincePost(post.timestamp)}</span>
                <span className="text-gray-400" aria-hidden="true">•</span>
                <span>Updates every {updateInterval} minutes</span>
              </div>
            </div>
          </div>
        </div>

        <PostMetricsTiles 
          post={post}
          averageMetrics={averageMetrics}
          getChangeFromAverage={getChangeFromAverage}
          isLoading={isLoading}
        />

        <PostRatioMetrics post={post} />

        <ViralityScore score={viralityScore} avgScore={avgScore} />
      </Card>

      <Card className="p-4">
        <PostPerformanceCharts 
          selectedPost={post}
          isLoading={isLoading}
        />
      </Card>

      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Engagement Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-[400px]">
            <LineChart 
              metric="likes"
              interval="hourly"
              currentCreator="Current Post"
            />
          </div>
          <div className="h-[400px]">
            <LineChart 
              metric="comments"
              interval="hourly"
              currentCreator="Current Post"
            />
          </div>
        </div>
      </Card>
    </div>
  );
};