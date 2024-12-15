export interface PostMetrics {
  views: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  engagement: number;
  followsFromPost: number;
  averageWatchPercentage: number;
  duration?: number;
}

export interface PostAnalyticsData {
  id: string;
  username: string;
  thumbnail: string;
  caption: string;
  timestamp: string;
  metrics: PostMetrics;
  averageMetrics?: PostMetrics;
}

export interface MetricError {
  message: string;
  code?: string;
}