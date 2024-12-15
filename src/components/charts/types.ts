export type Interval = '5min' | 'hourly' | 'daily' | 'weekly' | 'monthly';
export type PostMetric = 'views' | 'likes' | 'comments' | 'shares' | 'saves' | 'engagement' | 'posts';
export type AccountMetric = 'followers' | 'growth' | 'reached' | 'engaged' | 'engagement' | 'likes' | 'comments' | 'views' | 'posts';
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
  saves: 'Saves',
  engagement: 'Engagement Rate',
  followers: 'Followers',
  growth: 'Growth',
  reached: 'Reached',
  engaged: 'Engaged',
  posts: 'Posts'
};

export const metricTooltips: Record<MetricType, string> = {
  followers: 'Total number of accounts following your profile',
  growth: 'Overall account growth score based on followers, engagement, and reach',
  reached: 'Number of unique accounts that have seen your content',
  engaged: 'Number of unique accounts that interacted with your content',
  engagement: 'Percentage of viewers who engage with your content through likes, comments, or shares',
  likes: 'Average number of likes received per post in the selected time period',
  comments: 'Average number of comments received per post in the selected time period',
  views: 'Average number of views per post in the selected time period',
  posts: 'Total number of posts published to your account',
  shares: 'Number of times your content has been shared by other accounts',
  saves: 'Number of times your content has been saved by other accounts'
};