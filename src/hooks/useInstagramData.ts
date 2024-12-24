import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const fetchInstagramData = async (username: string) => {
  const { data, error } = await supabase.functions.invoke('fetch-instagram-data', {
    body: { username }
  });

  if (error) throw error;
  return data;
};

export const useInstagramData = (username: string | undefined) => {
  return useQuery({
    queryKey: ['instagram-data', username],
    queryFn: () => fetchInstagramData(username!),
    enabled: !!username,
    staleTime: 1000 * 60 * 60, // Consider data fresh for 1 hour
    refetchInterval: 1000 * 60 * 60, // Refetch every hour
  });
};