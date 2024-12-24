import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const fetchInstagramData = async (username: string) => {
  console.log('Fetching Instagram data for username:', username);
  try {
    const { data, error } = await supabase.functions.invoke('fetch-instagram-data', {
      body: { username }
    });

    if (error) {
      console.error('Error fetching Instagram data:', error);
      throw error;
    }

    console.log('Instagram data fetched successfully:', data);
    return data;
  } catch (error) {
    console.error('Error in fetchInstagramData:', error);
    throw error;
  }
};

export const useInstagramData = (username: string | undefined) => {
  return useQuery({
    queryKey: ['instagram-data', username],
    queryFn: () => fetchInstagramData(username!),
    enabled: !!username,
    staleTime: 1000 * 60 * 60, // Consider data fresh for 1 hour
    refetchInterval: 1000 * 60 * 60, // Refetch every hour
    retry: 2, // Retry failed requests twice
    meta: {
      errorMessage: 'Failed to fetch Instagram data'
    }
  });
};