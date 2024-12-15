import { PostAnalyticsData } from '../types/analytics';

export const mockPost: PostAnalyticsData = {
  id: '1',
  username: '@testuser',
  thumbnail: 'https://example.com/thumbnail.jpg',
  caption: 'Test post caption',
  timestamp: new Date().toISOString(),
  metrics: {
    views: 1000,
    likes: 100,
    comments: 50,
    shares: 25,
    saves: 75,
    engagement: 5.5,
    followsFromPost: 10,
    averageWatchPercentage: 65,
    duration: 60
  }
};