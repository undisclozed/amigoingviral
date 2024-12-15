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
  const viralityScore = Math.round((post.metrics.engagement * 100) + 
    (post.metrics.views / 1000) + 
    (post.metrics.likes / 100));
  const avgScore = Math.round(viralityScore * 0.8); // Simulated average score

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
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold">Post Performance</h2>
            <p className="text-sm text-gray-600">Posted on {new Date(post.timestamp).toLocaleDateString()}</p>
          </div>
          <img src={post.thumbnail} alt="Post thumbnail" className="w-24 h-24 rounded-lg object-cover" />
        </div>

        <ViralityScore score={viralityScore} avgScore={avgScore} />

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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

        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">Performance Over Time</h3>
          <div className="h-[400px]">
            <LineChart 
              metric="engagement"
              interval="hourly"
            />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Engagement Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-[300px]">
            <LineChart 
              metric="likes"
              interval="hourly"
            />
          </div>
          <div className="h-[300px]">
            <LineChart 
              metric="comments"
              interval="hourly"
            />
          </div>
        </div>
      </Card>
    </div>
  );
};