export type MetricType = 
  | "views" 
  | "likes" 
  | "comments" 
  | "shares" 
  | "saves" 
  | "engagement" 
  | "watch_time" 
  | "followers";

export interface ChartData {
  date: string;
  value: number;
}

export type Interval = "5min" | "hourly" | "daily" | "weekly" | "monthly";

export const metricLabels: Record<MetricType, string> = {
  views: "Views",
  likes: "Likes",
  comments: "Comments",
  shares: "Shares",
  saves: "Saves",
  engagement: "Engagement Rate",
  watch_time: "Watch Time",
  followers: "Followers"
};

export const metricTooltips: Record<MetricType, string> = {
  views: "Number of times your content has been viewed",
  likes: "Number of likes received",
  comments: "Number of comments received",
  shares: "Number of times your content has been shared",
  saves: "Number of times your content has been saved",
  engagement: "Percentage of viewers who engaged with your content",
  watch_time: "Average time viewers spent watching your content",
  followers: "Total number of followers"
};