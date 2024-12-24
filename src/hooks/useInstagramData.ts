import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useInstagramData = (username: string | undefined) => {
  return useQuery({
    queryKey: ['instagram-data', username],
    queryFn: async () => {
      if (!username) {
        throw new Error('No username provided');
      }
      
      console.log('Fetching Instagram data for:', username);
      const { data, error } = await supabase.functions.invoke('fetch-instagram-data', {
        body: { username }
      });

      if (error) {
        console.error('Error fetching Instagram data:', error);
        throw error;
      }

      if (!data?.data || !Array.isArray(data.data)) {
        console.error('Invalid data format received:', data);
        throw new Error('Invalid data format received from server');
      }

      console.log('Instagram data fetched:', data);
      return data;
    },
    enabled: !!username,
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    refetchInterval: 1000 * 60 * 5, // Refetch every 5 minutes
    retry: 2,
    meta: {
      errorMessage: 'Failed to fetch Instagram data'
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to fetch Instagram data');
    }
  });
};