import { Card } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { getTimeSincePost, getUpdateInterval } from "@/utils/timeUtils";
import { ViralityScore } from "../ViralityScore";
import { Post } from "../dashboard/types";
import { PostMetricsTiles } from "./metrics/PostMetricsTiles";
import { PostRatioMetrics } from "./metrics/PostRatioMetrics";
import { PostPerformanceCharts } from "./charts/PostPerformanceCharts";
import { Clock } from "lucide-react";
import { LineChart } from "@/components/LineChart";

interface PostAnalyticsProps {
  post: Post;
}

export const PostAnalytics = ({ post }: PostAnalyticsProps) => {
  const [selectedComparisonPost, setSelectedComparisonPost] = useState<Post | null>(null);
  const [updateInterval, setUpdateInterval] = useState<number>(5);

  useEffect(() => {
    const interval = getUpdateInterval(post.timestamp);
    setUpdateInterval(interval);

    const timer = setInterval(() => {
      console.log(`Updating data every ${interval} minutes`);
    }, interval * 60 * 1000);

    return () => clearInterval(timer);
  }, [post.timestamp]);

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
    <div className="space-y-4">
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <img src={post.thumbnail} alt="Post thumbnail" className="w-16 h-16 rounded-lg object-cover" />
            <div>
              <h2 className="text-lg font-semibold">Post Performance</h2>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span>Posted {getTimeSincePost(post.timestamp)}</span>
                <span className="text-gray-400">•</span>
                <span>Updates every {updateInterval} minutes</span>
              </div>
            </div>
          </div>
        </div>

        <PostMetricsTiles 
          post={post}
          averageMetrics={averageMetrics}
          getChangeFromAverage={getChangeFromAverage}
        />

        <PostRatioMetrics post={post} />

        <ViralityScore score={viralityScore} avgScore={avgScore} />
      </Card>

      <Card className="p-4">
        <PostPerformanceCharts 
          selectedPost={post}
          selectedComparisonPost={selectedComparisonPost}
        />
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