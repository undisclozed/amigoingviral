import { useQuery } from '@tanstack/react-query';
import { fetchInstagramData } from '@/lib/api';

export const useInstagramData = (username: string | undefined) => {
  return useQuery({
    queryKey: ['instagram-data', username],
    queryFn: () => fetchInstagramData(username!),
    enabled: !!username,
  });
};