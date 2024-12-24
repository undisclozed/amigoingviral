import { Post } from "@/components/dashboard/types";
import { useAuth } from "@/lib/auth/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useInstagramData } from "@/hooks/useInstagramData";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface PostsDataWrapperProps {
  children: (props: {
    posts: Post[];
    isLoading: boolean;
    error: Error | null;
    handleRefresh: () => void;
  }) => React.ReactNode;
}

export const PostsDataWrapper = ({ children }: PostsDataWrapperProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      console.log('Fetching profile for user:', user?.id);
      const { data, error } = await supabase
        .from('profiles')
        .select('instagram_account')
        .eq('id', user?.id)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching profile:', error);
        throw error;
      }
      
      console.log('Profile data:', data);
      return data;
    },
    enabled: !!user?.id,
    retry: 1,
    onError: (error: Error) => {
      toast.error('Failed to fetch profile data');
      console.error('Profile fetch error:', error);
    }
  });

  const { 
    data: instagramData, 
    isLoading: isInstagramLoading,
    error: instagramError,
    refetch: refetchInstagramData
  } = useInstagramData(profile?.instagram_account);

  if (isProfileLoading || isInstagramLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!profile?.instagram_account) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">No Instagram Account Connected</h2>
          <p className="text-gray-600 mb-6">
            Please update your profile with your Instagram account to view your posts and analytics.
          </p>
          <Button onClick={() => navigate('/settings')} className="w-full sm:w-auto">
            Update Profile
          </Button>
        </Card>
      </div>
    );
  }

  const posts = instagramData?.data?.map((post: any) => {
    console.log('Processing post:', post);
    try {
      return {
        id: post.id || `temp-${Math.random().toString(36).substr(2, 9)}`,
        username: post.username || profile?.instagram_account || 'Unknown',
        thumbnail: post.thumbnail || '/placeholder.svg',
        caption: post.caption || 'No caption',
        timestamp: post.timestamp || new Date().toISOString(),
        metrics: {
          views: post.metrics?.views || 0,
          likes: post.metrics?.likes || 0,
          comments: post.metrics?.comments || 0,
          shares: post.metrics?.shares || 0,
          saves: post.metrics?.saves || 0,
          engagement: post.metrics?.engagement || 0,
          followsFromPost: post.metrics?.followsFromPost || 0,
          averageWatchPercentage: post.metrics?.averageWatchPercentage || 0,
        }
      };
    } catch (error) {
      console.error('Error processing post:', error, post);
      return null;
    }
  }).filter(Boolean) || [];

  console.log('Transformed posts:', posts);

  return <>{children({ 
    posts, 
    isLoading: isInstagramLoading, 
    error: instagramError, 
    handleRefresh: refetchInstagramData 
  })}</>;
};