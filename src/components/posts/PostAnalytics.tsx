import { Card } from "@/components/ui/card";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { LineChart } from "../LineChart";
import { ViralityScore } from "../ViralityScore";
import { MetricTile } from "./MetricTile";
import { Post } from "../dashboard/types";
import { useState } from "react";

interface PostAnalyticsProps {
  post: Post;
}

export const PostAnalytics = ({ post }: PostAnalyticsProps) => {
  const [selectedComparisonPost, setSelectedComparisonPost] = useState<Post | null>(null);

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

  // Calculate engagement rate
  const totalEngagements = post.metrics.likes + post.metrics.comments + 
    post.metrics.saves + post.metrics.shares;
  const engagementRate = (totalEngagements / post.metrics.views) * 100;

  // Calculate ratios
  const likesToReachRatio = (post.metrics.likes / post.metrics.views) * 100;
  const commentsToReachRatio = (post.metrics.comments / post.metrics.views) * 100;
  const savesToReachRatio = (post.metrics.saves / post.metrics.views) * 100;

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="flex items-center gap-4 mb-4">
          <img src={post.thumbnail} alt="Post thumbnail" className="w-16 h-16 rounded-lg object-cover" />
          <div>
            <h2 className="text-lg font-semibold">Post Performance</h2>
            <p className="text-sm text-gray-600">Posted on {new Date(post.timestamp).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 mb-4">
          {/* Core Metrics */}
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
            title="Follows"
            value={post.metrics.followsFromPost.toLocaleString()}
            change={getChangeFromAverage(post.metrics.followsFromPost, averageMetrics.followsFromPost)}
            icon={<Info className="h-4 w-4" />}
          />
          <MetricTile
            title="Avg Watch %"
            value={`${post.metrics.averageWatchPercentage}%`}
            change={getChangeFromAverage(post.metrics.averageWatchPercentage, averageMetrics.averageWatchPercentage)}
            icon={<Info className="h-4 w-4" />}
          />
        </div>

        {/* Ratio Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
          <MetricTile
            title="Likes/Reach"
            value={`${likesToReachRatio.toFixed(1)}%`}
            icon={<Info className="h-4 w-4" />}
          />
          <MetricTile
            title="Comments/Reach"
            value={`${commentsToReachRatio.toFixed(1)}%`}
            icon={<Info className="h-4 w-4" />}
          />
          <MetricTile
            title="Saves/Reach"
            value={`${savesToReachRatio.toFixed(1)}%`}
            icon={<Info className="h-4 w-4" />}
          />
        </div>

        <ViralityScore score={viralityScore} avgScore={avgScore} />
      </Card>

      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Performance Over Time</h3>
        <div className="h-[400px]">
          <LineChart 
            metric="engagement"
            interval="hourly"
            showComparison={!!selectedComparisonPost}
            currentCreator="Current Post"
            comparisonCreator={selectedComparisonPost?.caption}
          />
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Engagement Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-[400px]">
            <LineChart 
              metric="likes"
              interval="hourly"
              showComparison={!!selectedComparisonPost}
              currentCreator="Current Post"
              comparisonCreator={selectedComparisonPost?.caption}
            />
          </div>
          <div className="h-[400px]">
            <LineChart 
              metric="comments"
              interval="hourly"
              showComparison={!!selectedComparisonPost}
              currentCreator="Current Post"
              comparisonCreator={selectedComparisonPost?.caption}
            />
          </div>
        </div>
      </Card>
    </div>
  );
};