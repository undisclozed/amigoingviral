import { Users, TrendingUp, Target, Zap, BarChart2, ThumbsUp, MessageCircle, Eye } from "lucide-react";
import type { MetricData } from "./types";

export const getMetricsData = (): MetricData[] => [
  {
    id: 'followers',
    title: "Total Followers",
    value: "10,234",
    change: 2.5,
    subValue: "Growth: +156 this week",
    period: "Last 7 days",
    icon: Users,
    metric: "followers"
  },
  {
    id: 'posts',
    title: "Total Posts",
    value: "342",
    change: 8.3,
    subValue: "+12 posts this month",
    period: "Last 30 days",
    icon: BarChart2,
    metric: "posts"
  },
  {
    id: 'reached',
    title: "Accounts Reached",
    value: "45.2K",
    change: 5.8,
    subValue: "+12.3K from last period",
    period: "Last 30 days",
    icon: Target,
    metric: "reached"
  },
  {
    id: 'engaged',
    title: "Accounts Engaged",
    value: "12.4K",
    change: 3.2,
    subValue: "+2.1K from last period",
    period: "Last 30 days",
    icon: Zap,
    metric: "engaged"
  },
  {
    id: 'engagement',
    title: "Avg Engagement Rate",
    value: "4.8%",
    change: 0.5,
    subValue: "Higher than last period",
    period: "Last 30 days",
    icon: TrendingUp,
    metric: "engagement"
  },
  {
    id: 'likes',
    title: "Avg Likes per Post",
    value: "856",
    change: -1.2,
    subValue: "-24 from last period",
    period: "Last 30 days",
    icon: ThumbsUp,
    metric: "likes"
  },
  {
    id: 'comments',
    title: "Avg Comments per Post",
    value: "42",
    change: 2.8,
    subValue: "+5 from last period",
    period: "Last 30 days",
    icon: MessageCircle,
    metric: "comments"
  },
  {
    id: 'views',
    title: "Avg Views per Post",
    value: "2.3K",
    change: 4.5,
    subValue: "+245 from last period",
    period: "Last 30 days",
    icon: Eye,
    metric: "views"
  }
];