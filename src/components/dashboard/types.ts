export interface Post {
  id: string;
  username: string;
  thumbnail: string;
  caption: string;
  timestamp: string;
  metrics: {
    views: number;
    likes: number;
    comments: number;
    shares: number;
    saves: number;
    engagement: number;
    followsFromPost: number;
    averageWatchPercentage: number;
  };
}
