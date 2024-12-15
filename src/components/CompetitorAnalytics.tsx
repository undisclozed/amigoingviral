import { Card } from "@/components/ui/card";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { LineChart } from "./LineChart";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useState } from "react";

// Mock competitor data - in a real app, this would come from an API
const competitorData = {
  username: "@creativestudio",
  metrics: {
    followers: 125000,
    followerGrowth: 2.5,
    posts: 892,
    reachLastMonth: 450000,
    engagementRate: 4.2,
    avgLikes: 3200,
    avgComments: 145,
    avgViews: 15000,
  }
};

const userMetrics = {
  followers: 85000,
  followerGrowth: 3.1,
  posts: 342,
  reachLastMonth: 280000,
  engagementRate: 4.8,
  avgLikes: 2800,
  avgComments: 180,
  avgViews: 12000,
};

const CompetitorAnalytics = () => {
  const [competitorHandle, setCompetitorHandle] = useState("");
  const [selectedCompetitor, setSelectedCompetitor] = useState<typeof competitorData | null>(null);

  const generateInsights = () => {
    const insights = [];
    const metrics = selectedCompetitor?.metrics || competitorData.metrics;
    
    if (userMetrics.engagementRate > metrics.engagementRate) {
      insights.push("Your engagement rate is higher, indicating stronger audience connection");
    } else {
      insights.push("Focus on increasing engagement through more interactive content");
    }

    if (userMetrics.followerGrowth > metrics.followerGrowth) {
      insights.push("Your account is growing faster than the competitor");
    } else {
      insights.push("Consider analyzing competitor content strategy for growth opportunities");
    }

    if (userMetrics.avgComments > metrics.avgComments) {
      insights.push("You receive more comments, showing better audience interaction");
    }

    return insights;
  };

  const handleCompetitorSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock API call - in a real app, this would fetch actual competitor data
    setSelectedCompetitor({
      username: competitorHandle,
      metrics: {
        followers: Math.floor(Math.random() * 200000),
        followerGrowth: Math.random() * 5,
        posts: Math.floor(Math.random() * 1000),
        reachLastMonth: Math.floor(Math.random() * 500000),
        engagementRate: Math.random() * 6,
        avgLikes: Math.floor(Math.random() * 5000),
        avgComments: Math.floor(Math.random() * 200),
        avgViews: Math.floor(Math.random() * 20000),
      }
    });
  };

  return (
    <Card className="p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <h3 className="text-xl font-semibold">Competitor Analysis</h3>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-gray-400" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>Compare your account metrics with similar creators in your niche.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <form onSubmit={handleCompetitorSearch} className="flex gap-2">
          <Input
            placeholder="Enter competitor's handle"
            value={competitorHandle}
            onChange={(e) => setCompetitorHandle(e.target.value)}
            className="w-64"
          />
          <Button type="submit">Compare</Button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="space-y-4">
          <h4 className="font-medium">Your Metrics</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Followers</span>
              <span className="font-medium">{userMetrics.followers.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Follower Growth</span>
              <span className="font-medium">{userMetrics.followerGrowth}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Engagement Rate</span>
              <span className="font-medium">{userMetrics.engagementRate}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Avg. Likes</span>
              <span className="font-medium">{userMetrics.avgLikes.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Avg. Comments</span>
              <span className="font-medium">{userMetrics.avgComments.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium">Competitor Metrics ({selectedCompetitor?.username || competitorData.username})</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Followers</span>
              <span className="font-medium">{(selectedCompetitor?.metrics || competitorData.metrics).followers.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Follower Growth</span>
              <span className="font-medium">{(selectedCompetitor?.metrics || competitorData.metrics).followerGrowth}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Engagement Rate</span>
              <span className="font-medium">{(selectedCompetitor?.metrics || competitorData.metrics).engagementRate}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Avg. Likes</span>
              <span className="font-medium">{(selectedCompetitor?.metrics || competitorData.metrics).avgLikes.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Avg. Comments</span>
              <span className="font-medium">{(selectedCompetitor?.metrics || competitorData.metrics).avgComments.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <h4 className="font-medium">Competitive Insights</h4>
        <ul className="space-y-2">
          {generateInsights().map((insight, index) => (
            <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
              <div className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0 mt-1.5" />
              {insight}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6">
        <h4 className="font-medium mb-4">Growth Comparison</h4>
        <div className="h-[550px]">
          <LineChart 
            metric="followers"
            interval="monthly"
            showComparison={true}
            currentCreator="Your Account"
            comparisonCreator={selectedCompetitor?.username || competitorData.username}
          />
        </div>
      </div>
    </Card>
  );
};

export default CompetitorAnalytics;