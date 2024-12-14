import { Users, TrendingUp, Target, Zap, MessageCircle, Eye, ThumbsUp, BarChart2 } from "lucide-react";
import { MetricCard } from "@/components/MetricCard";
import { MetricChartDialog } from "@/components/MetricChartDialog";
import type { MetricType } from "./charts/types";

export const AccountOverview = () => {
  const metrics: Array<{
    id: string;
    title: string;
    value: string;
    change: number;
    subValue: string;
    period: string;
    icon: JSX.Element;
    metric: MetricType;
  }> = [
    {
      id: 'followers',
      title: "Total Followers",
      value: "10,234",
      change: 2.5,
      subValue: "Growth: +156 this week",
      period: "Last 7 days",
      icon: <Users className="h-4 w-4" />,
      metric: "followers"
    },
    {
      id: 'posts',
      title: "Total Posts",
      value: "342",
      change: 8.3,
      subValue: "+12 posts this month",
      period: "Last 30 days",
      icon: <BarChart2 className="h-4 w-4" />,
      metric: "posts"
    },
    {
      id: 'reached',
      title: "Accounts Reached",
      value: "45.2K",
      change: 5.8,
      subValue: "+12.3K from last period",
      period: "Last 30 days",
      icon: <Target className="h-4 w-4" />,
      metric: "reached"
    },
    {
      id: 'engaged',
      title: "Accounts Engaged",
      value: "12.4K",
      change: 3.2,
      subValue: "+2.1K from last period",
      period: "Last 30 days",
      icon: <Zap className="h-4 w-4" />,
      metric: "engaged"
    },
    {
      id: 'engagement',
      title: "Avg Engagement Rate",
      value: "4.8%",
      change: 0.5,
      subValue: "Higher than last period",
      period: "Last 30 days",
      icon: <TrendingUp className="h-4 w-4" />,
      metric: "engagement"
    },
    {
      id: 'likes',
      title: "Avg Likes per Post",
      value: "856",
      change: -1.2,
      subValue: "-24 from last period",
      period: "Last 30 days",
      icon: <ThumbsUp className="h-4 w-4" />,
      metric: "likes"
    },
    {
      id: 'comments',
      title: "Avg Comments per Post",
      value: "42",
      change: 2.8,
      subValue: "+5 from last period",
      period: "Last 30 days",
      icon: <MessageCircle className="h-4 w-4" />,
      metric: "comments"
    },
    {
      id: 'views',
      title: "Avg Views per Post",
      value: "2.3K",
      change: 4.5,
      subValue: "+245 from last period",
      period: "Last 30 days",
      icon: <Eye className="h-4 w-4" />,
      metric: "views"
    }
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-xl sm:text-2xl font-semibold">Account Overview</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <div key={metric.id} onClick={() => document.getElementById(`${metric.id}-dialog`)?.click()}>
            <MetricCard
              title={metric.title}
              value={metric.value}
              change={metric.change}
              subValue={metric.subValue}
              period={metric.period}
              icon={metric.icon}
              metric={metric.metric}
            />
            <MetricChartDialog
              title={metric.title}
              metric={metric.metric}
              currentValue={metric.value}
              change={metric.change}
            />
          </div>
        ))}
      </div>
    </div>
  );
};