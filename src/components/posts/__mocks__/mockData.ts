import { PostAnalyticsData } from '../types/analytics';

export const mockPost: PostAnalyticsData = {
  id: '1',
  username: '@testuser',
  thumbnail: '/placeholder.svg',
  caption: 'Test post',
  timestamp: new Date().toISOString(),
  metrics: {
    views: 10000,
    likes: 1000,
    comments: 100,
    shares: 50,
    saves: 200,
    engagement: 0.05,
    followsFromPost: 25,
    averageWatchPercentage: 75,
    duration: 60
  }
};