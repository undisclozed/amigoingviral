import { useState } from "react";
import { Card } from "@/components/ui/card";
import { AccountMetricsOverview } from "@/components/posts/AccountMetricsOverview";
import { EmptyPostsState } from "@/components/posts/EmptyPostsState";
import { PostsList } from "@/components/posts/PostsList";
import { CompetitorSearch } from "@/components/competitor-analytics/CompetitorSearch";
import { PostAnalytics } from "@/components/posts/PostAnalytics";
import { toast } from "sonner";
import { Post } from "@/components/dashboard/types";
import { useInstagramData } from "@/hooks/useInstagramData";
import { useAuth } from "@/lib/auth/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

const Posts = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [competitorHandle, setCompetitorHandle] = useState("");
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const { user } = useAuth();
  
  // Fetch the user's Instagram handle with better error handling
  const { data: profile, isLoading: isProfileLoading, error: profileError } = useQuery({
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
    retry: 1
  });

  // Fetch Instagram data with the profile
  const { 
    data: instagramData, 
    isLoading: isInstagramLoading, 
    error: instagramError 
  } = useInstagramData(profile?.instagram_account);

  console.log('Instagram data:', instagramData);
  console.log('Instagram error:', instagramError);

  const posts = instagramData?.map((post: any) => ({
    id: post.id,
    username: post.username,
    thumbnail: post.thumbnail,
    caption: post.caption,
    timestamp: post.timestamp,
    metrics: {
      views: post.metrics.views || 0,
      likes: post.metrics.likes || 0,
      comments: post.metrics.comments || 0,
      shares: post.metrics.shares || 0,
      saves: post.metrics.saves || 0,
      engagement: post.metrics.engagement || 0,
      followsFromPost: post.metrics.followsFromPost || 0,
      averageWatchPercentage: post.metrics.averageWatchPercentage || 0,
    }
  })) || [];

  const mockAccountMetrics = {
    views: 150000,
    likes: 25000,
    comments: 1500,
    shares: 500,
    saves: 2000,
    engagement: 5.2,
    followers: 10000
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!competitorHandle) return;
    toast.info(
      posts.length > 0 
        ? `Viewing analytics for ${competitorHandle}`
        : "Start Tracking Now! This creator's data is not yet available."
    );
  };

  const handlePostSelect = (postId: string | null) => {
    setSelectedPostId(postId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const selectedPost = selectedPostId ? posts.find(post => post.id === selectedPostId) : null;

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

  if (profileError) {
    console.error('Profile error:', profileError);
    toast.error("Failed to load profile. Please try again later.");
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Error Loading Profile</h2>
          <p className="text-gray-600">
            There was an error loading your profile. Please refresh the page or try again later.
          </p>
        </Card>
      </div>
    );
  }

  if (!profile?.instagram_account) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">No Instagram Account Connected</h2>
          <p className="text-gray-600">
            Please update your profile with your Instagram account to view your posts and analytics.
          </p>
        </Card>
      </div>
    );
  }

  if (instagramError) {
    console.error('Instagram data error:', instagramError);
    toast.error("Failed to fetch Instagram data. Please try again later.");
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Creator Analytics</h1>
        <CompetitorSearch
          competitorHandle={competitorHandle}
          onHandleChange={setCompetitorHandle}
          onSearch={handleSearch}
        />
      </div>

      <AccountMetricsOverview 
        accountMetrics={mockAccountMetrics}
        postsCount={posts.length}
      />

      {posts.length === 0 ? (
        <EmptyPostsState 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
        />
      ) : (
        <div className="space-y-6">
          {selectedPost && (
            <PostAnalytics post={selectedPost as any} />
          )}
          <Card className="p-6">
            <PostsList 
              posts={posts} 
              onPostSelect={handlePostSelect}
            />
          </Card>
        </div>
      )}
    </div>
  );
};

export default Posts;
