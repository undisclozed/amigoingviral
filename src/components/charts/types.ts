export type MetricType = 
  | "views"
  | "likes"
  | "comments"
  | "shares"
  | "saves"
  | "engagement"
  | "followers"
  | "posts"
  | "reached"
  | "engaged"
  | "watch_time";

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
  posts: "Posts",
  reached: "Accounts Reached",
  engaged: "Accounts Engaged",
  watch_time: "Watch Time"
};

export const metricTooltips: Record<MetricType, string> = {
  views: "Total number of times your content has been viewed",
  likes: "Total number of likes received",
  comments: "Total number of comments received",
  shares: "Number of times your content has been shared",
  saves: "Number of times your content has been saved",
  engagement: "Percentage of viewers who engaged with your content",
  followers: "Total number of account followers",
  posts: "Total number of posts published",
  reached: "Number of unique accounts that saw your content",
  engaged: "Number of unique accounts that engaged with your content",
  watch_time: "Average duration viewers spent watching your content"
};