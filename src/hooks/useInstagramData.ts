import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useInstagramData = (username: string | undefined) => {
  return useQuery({
    queryKey: ['instagram-data', username],
    queryFn: async () => {
      if (!username) {
        throw new Error('No username provided');
      }
      
      console.log('Mocking Instagram data for:', username);
      
      // Return mock data
      return {
        data: Array(10).fill(null).map((_, index) => ({
          id: `mock-${index}`,
          username: username,
          thumbnail: 'https://picsum.photos/400/400',
          caption: `Mock post ${index + 1}`,
          timestamp: new Date(Date.now() - index * 24 * 60 * 60 * 1000).toISOString(),
          metrics: {
            views: Math.floor(Math.random() * 10000),
            likes: Math.floor(Math.random() * 1000),
            comments: Math.floor(Math.random() * 100),
            shares: Math.floor(Math.random() * 50),
            saves: Math.floor(Math.random() * 200),
            engagement: Math.random() * 0.1,
            followsFromPost: Math.floor(Math.random() * 20),
            averageWatchPercentage: Math.random() * 100,
          }
        }))
      };
    },
    enabled: !!username,
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    refetchInterval: 1000 * 60 * 5, // Refetch every 5 minutes
    retry: 2,
    meta: {
      errorMessage: 'Failed to fetch Instagram data',
      onError: (error: Error) => {
        toast.error(error.message || 'Failed to fetch Instagram data');
      }
    }
  });
};