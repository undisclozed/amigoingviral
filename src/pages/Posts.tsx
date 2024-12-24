import { useState } from "react";
import { Card } from "@/components/ui/card";
import { AccountMetricsOverview } from "@/components/posts/AccountMetricsOverview";
import { PostsDataWrapper } from "@/components/posts/PostsDataWrapper";
import { PostsList } from "@/components/posts/PostsList";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth/AuthContext";

const Posts = () => {
  const { user } = useAuth();
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  const { data: profile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('instagram_account')
        .eq('id', user?.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id
  });

  const mockAccountMetrics = {
    views: 150000,
    likes: 25000,
    comments: 1500,
    shares: 500,
    saves: 2000,
    engagement: 5.2,
    followers: 10000
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <PostsDataWrapper>
        {({ posts, isLoading, error, handleRefresh }) => (
          <>
            <AccountMetricsOverview 
              accountMetrics={mockAccountMetrics}
              postsCount={posts?.length || 0}
              username={profile?.instagram_account || ''}
            />
            <Card className="p-6">
              <PostsList 
                posts={posts} 
                onPostSelect={setSelectedPostId}
                onRefresh={handleRefresh}
                error={error}
              />
            </Card>
          </>
        )}
      </PostsDataWrapper>
    </div>
  );
};

export default Posts;
