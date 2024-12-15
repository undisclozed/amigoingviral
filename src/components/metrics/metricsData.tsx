import { Users, Eye, ThumbsUp, MessageCircle, Share2, Bookmark, Percent } from "lucide-react";
import type { MetricData } from "./types";

export const getMetricsData = (): MetricData[] => [
  {
    id: "followers",
    title: "Followers",
    value: "12.5K",
    change: 2.5,
    subValue: "+310 this week",
    period: "Last 7 days",
    icon: Users,
    metric: "followers"
  },
  {
    id: "reach",
    title: "Accounts Reached",
    value: "45.2K",
    change: 3.8,
    subValue: "+5.2K this week",
    period: "Last 7 days",
    icon: Eye,
    metric: "reach"
  },
  {
    id: "engagement",
    title: "Avg. Engagement",
    value: "8.2%",
    change: 1.2,
    subValue: "From 7.0% last week",
    period: "Last 7 days",
    icon: Percent,
    metric: "engagement"
  },
  {
    id: "saves",
    title: "Post Saves",
    value: "2.8K",
    change: 4.5,
    subValue: "+420 this week",
    period: "Last 7 days",
    icon: Bookmark,
    metric: "saves"
  }
];