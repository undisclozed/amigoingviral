import { MetricTile } from "../MetricTile";
import { Info, Clock, Play, Users } from "lucide-react";
import { Post } from "../../dashboard/types";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PostMetricsTilesProps {
  post: Post;
  averageMetrics: {
    views: number;
    likes: number;
    comments: number;
    shares: number;
    saves: number;
    engagement: number;
    followsFromPost: number;
    averageWatchPercentage: number;
  };
  getChangeFromAverage: (value: number, average: number) => number;
}

export const PostMetricsTiles = ({ 
  post, 
  averageMetrics, 
  getChangeFromAverage 
}: PostMetricsTilesProps) => {
  // Calculate engagement metrics
  const totalEngagements = post.metrics.likes + post.metrics.comments + 
    post.metrics.saves + post.metrics.shares;
  const engagementRate = (totalEngagements / post.metrics.views) * 100;

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 mb-4">
        <MetricTile
          title="Views"
          value={post.metrics.views.toLocaleString()}
          change={getChangeFromAverage(post.metrics.views, averageMetrics.views)}
          icon={<Info className="h-4 w-4" />}
          metric="views"
        />
        <MetricTile
          title="Likes"
          value={post.metrics.likes.toLocaleString()}
          change={getChangeFromAverage(post.metrics.likes, averageMetrics.likes)}
          icon={<Info className="h-4 w-4" />}
          metric="likes"
        />
        <MetricTile
          title="Comments"
          value={post.metrics.comments.toLocaleString()}
          change={getChangeFromAverage(post.metrics.comments, averageMetrics.comments)}
          icon={<Info className="h-4 w-4" />}
          metric="comments"
        />
        <MetricTile
          title="Shares"
          value={post.metrics.shares.toLocaleString()}
          change={getChangeFromAverage(post.metrics.shares, averageMetrics.shares)}
          icon={<Info className="h-4 w-4" />}
          metric="shares"
        />
        <MetricTile
          title="Saves"
          value={post.metrics.saves.toLocaleString()}
          change={getChangeFromAverage(post.metrics.saves, averageMetrics.saves)}
          icon={<Info className="h-4 w-4" />}
          metric="saves"
        />
        <MetricTile
          title="Engagement Rate"
          value={`${engagementRate.toFixed(1)}%`}
          change={getChangeFromAverage(engagementRate, averageMetrics.engagement)}
          icon={<Info className="h-4 w-4" />}
          metric="engagement"
        />
        <MetricTile
          title="New Follows"
          value={post.metrics.followsFromPost.toLocaleString()}
          change={getChangeFromAverage(post.metrics.followsFromPost, averageMetrics.followsFromPost)}
          icon={<Users className="h-4 w-4" />}
        />
        <MetricTile
          title="Watch Time"
          value={`${post.metrics.averageWatchPercentage}%`}
          change={getChangeFromAverage(post.metrics.averageWatchPercentage, averageMetrics.averageWatchPercentage)}
          icon={<Play className="h-4 w-4" />}
        />
      </div>
    </>
  );
};