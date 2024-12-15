export type MetricType = 
  | 'views' 
  | 'likes' 
  | 'comments' 
  | 'shares' 
  | 'engagement' 
  | 'followers'
  | 'posts'
  | 'reached'
  | 'engaged'
  | 'growth';

export type Interval = '5min' | 'hourly' | 'daily' | 'weekly' | 'monthly';

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
  posts: 'Posts',
  reached: 'Accounts Reached',
  engaged: 'Accounts Engaged',
  growth: 'Growth'
};