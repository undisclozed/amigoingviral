import { useState } from "react";
import { Card } from "@/components/ui/card";
import { AccountMetricsOverview } from "@/components/posts/AccountMetricsOverview";
import { EmptyPostsState } from "@/components/posts/EmptyPostsState";
import { PostsList } from "@/components/posts/PostsList";
import { CompetitorSearch } from "@/components/competitor-analytics/CompetitorSearch";
import { PostAnalytics } from "@/components/posts/PostAnalytics";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PostsDataWrapper } from "@/components/posts/PostsDataWrapper";

const Posts = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [competitorHandle, setCompetitorHandle] = useState("");
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

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
      "Start Tracking Now! This creator's data is not yet available."
    );
  };

  const handlePostSelect = (postId: string | null) => {
    setSelectedPostId(postId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <PostsDataWrapper>
      {({ posts, isLoading, error, handleRefresh }) => (
        <div className="container mx-auto px-4 py-8 space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Creator Analytics</h1>
            <div className="flex gap-4">
              <Button onClick={handleRefresh} variant="outline">
                Refresh Data
              </Button>
              <CompetitorSearch
                competitorHandle={competitorHandle}
                onHandleChange={setCompetitorHandle}
                onSearch={handleSearch}
              />
            </div>
          </div>

          <AccountMetricsOverview 
            accountMetrics={mockAccountMetrics}
            postsCount={posts?.length || 0}
          />

          {!posts || posts.length === 0 ? (
            <EmptyPostsState 
              searchQuery={searchQuery} 
              setSearchQuery={setSearchQuery} 
            />
          ) : (
            <div className="space-y-6">
              {selectedPostId && (
                <PostAnalytics 
                  post={posts.find(post => post.id === selectedPostId) || null} 
                />
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
      )}
    </PostsDataWrapper>
  );
};

export default Posts;