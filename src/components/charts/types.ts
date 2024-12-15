export type MetricType = 
  | "views" 
  | "likes" 
  | "comments" 
  | "shares" 
  | "saves" 
  | "engagement" 
  | "followers" 
  | "reach";

export type Interval = "5min" | "hourly" | "daily" | "weekly" | "monthly";

export interface LineChartProps {
  metric?: MetricType;
  interval?: Interval;
  showComparison?: boolean;
  currentCreator?: string;
  comparisonCreator?: string;
}

export const metricLabels: Record<MetricType, string> = {
  views: "Views",
  likes: "Likes",
  comments: "Comments",
  shares: "Shares",
  saves: "Saves",
  engagement: "Engagement Rate",
  followers: "Followers",
  reach: "Reach"
};

export const metricTooltips: Record<MetricType, string> = {
  views: "Total number of times your content has been viewed",
  likes: "Total number of likes received on your content",
  comments: "Total number of comments received on your content",
  shares: "Number of times your content has been shared",
  saves: "Number of times your content has been saved",
  engagement: "Percentage of viewers who engaged with your content",
  followers: "Total number of accounts following you",
  reach: "Number of unique accounts that have seen your content"
};