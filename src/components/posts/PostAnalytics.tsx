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
import PostSelectionSection from "../dashboard/PostSelectionSection";
import { useState } from "react";
import { Post } from "../dashboard/types";

interface PostAnalyticsProps {
  post: {
    id: number;
    thumbnail: string;
    caption: string;
    timestamp: string;
    metrics: {
      views: number;
      likes: number;
      comments: number;
      shares: number;
      saves: number;
      engagement: number;
    };
  };
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
  };

  return (
    <div className="space-y-4">
      <PostSelectionSection
        selectedPost={selectedComparisonPost}
        setSelectedPost={setSelectedComparisonPost}
      />

      <Card className="p-4">
        <div className="flex items-center gap-4 mb-4">
          <img src={post.thumbnail} alt="Post thumbnail" className="w-16 h-16 rounded-lg object-cover" />
          <div>
            <h2 className="text-lg font-semibold">Post Performance</h2>
            <p className="text-sm text-gray-600">Posted on {new Date(post.timestamp).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mb-4">
          {Object.entries(post.metrics).map(([key, value]) => {
            const average = averageMetrics[key as keyof typeof averageMetrics];
            const change = getChangeFromAverage(value, average);
            
            return (
              <MetricTile
                key={key}
                title={key.charAt(0).toUpperCase() + key.slice(1)}
                value={value.toLocaleString()}
                change={Math.round(change)}
                icon={<Info className="h-4 w-4" />}
                metric={key as any}
              />
            );
          })}
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