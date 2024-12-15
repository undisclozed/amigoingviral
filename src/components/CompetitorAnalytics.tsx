import { Card } from "@/components/ui/card";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";
import { CompetitorSearch } from "./competitor-analytics/CompetitorSearch";
import { MetricsComparison } from "./competitor-analytics/MetricsComparison";
import { CompetitorInsights } from "./competitor-analytics/CompetitorInsights";
import { GrowthChart } from "./competitor-analytics/GrowthChart";

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
          <h3 className="text-xl font-semibold">Creator Analysis</h3>
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
        <CompetitorSearch
          competitorHandle={competitorHandle}
          onHandleChange={setCompetitorHandle}
          onSearch={handleCompetitorSearch}
        />
      </div>

      <MetricsComparison
        userMetrics={userMetrics}
        competitorMetrics={selectedCompetitor?.metrics || competitorData.metrics}
        competitorUsername={selectedCompetitor?.username || competitorData.username}
      />

      <CompetitorInsights insights={generateInsights()} />

      <GrowthChart
        currentCreator="Your Account"
        comparisonCreator={selectedCompetitor?.username || competitorData.username}
      />
    </Card>
  );
};

export default CompetitorAnalytics;