export type Interval = '5min' | 'hourly' | 'daily' | 'weekly' | 'monthly';
export type PostMetric = 'views' | 'likes' | 'comments' | 'shares' | 'engagement' | 'posts';
export type AccountMetric = 'followers' | 'growth' | 'reached' | 'engaged';
export type MetricType = PostMetric | AccountMetric;

export interface ChartData {
  date: string;
  value: number;
}

export interface LineChartProps {
  metric?: MetricType;
  interval?: Interval;
  showComparison?: boolean;
  currentCreator?: string;
  comparisonCreator?: string;
}

export const metricLabels: Record<MetricType, string> = {
  views: 'Views',
  likes: 'Likes',
  comments: 'Comments',
  shares: 'Shares',
  engagement: 'Engagement Rate',
  followers: 'Followers',
  growth: 'Growth',
  reached: 'Reached',
  engaged: 'Engaged',
  posts: 'Posts'
};