import { useState } from "react";
import { Card } from "@/components/ui/card";
import { AppSidebar } from "@/components/shared/AppSidebar";
import { AccountMetricsOverview } from "@/components/posts/AccountMetricsOverview";
import { EmptyPostsState } from "@/components/posts/EmptyPostsState";
import { PostsList } from "@/components/posts/PostsList";
import { CompetitorSearch } from "@/components/competitor-analytics/CompetitorSearch";
import { PostAnalytics } from "@/components/posts/PostAnalytics";
import { toast } from "sonner";
import { Post } from "@/components/dashboard/types";

const postImages = [
  "https://images.unsplash.com/photo-1509440159596-0249088772ff",
  "https://images.unsplash.com/photo-1549931319-a545dcf3bc73",
  "https://images.unsplash.com/photo-1486427944299-d1955d23e34d",
  "https://images.unsplash.com/photo-1517686469429-8bdb88b9f907",
  "https://images.unsplash.com/photo-1495147466023-ac5c588e2e94",
  "https://images.unsplash.com/photo-1464305795204-6f5bbfc7fb81",
];

const generateMockPosts = (): Post[] => {
  return Array.from({ length: 34 }, (_, index) => ({
    id: String(index + 1),
    username: "@creator",
    thumbnail: postImages[index % postImages.length],
    caption: `Post ${index + 1} - This is a sample caption for testing purposes. #testing #sample`,
    timestamp: new Date(Date.now() - index * 24 * 60 * 60 * 1000).toISOString(),
    metrics: {
      views: Math.floor(Math.random() * 50000) + 10000,
      likes: Math.floor(Math.random() * 5000) + 500,
      comments: Math.floor(Math.random() * 300) + 50,
      shares: Math.floor(Math.random() * 200) + 20,
      saves: Math.floor(Math.random() * 400) + 40,
      engagement: Number((Math.random() * 5 + 2).toFixed(2)),
      followsFromPost: Math.floor(Math.random() * 100) + 10,
      averageWatchPercentage: Number((Math.random() * 40 + 60).toFixed(2)),
    }
  }));
};

const Posts = () => {
  const [posts, setPosts] = useState<Post[]>(generateMockPosts());
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
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
      posts.length > 0 
        ? `Viewing analytics for ${competitorHandle}`
        : "Start Tracking Now! This creator's data is not yet available."
    );
  };

  const handlePostSelect = (postId: string | null) => {
    setSelectedPostId(postId);
    // Smooth scroll to top of the page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const selectedPost = selectedPostId ? posts.find(post => post.id === selectedPostId) : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <AppSidebar onCollapse={setSidebarCollapsed} />
      <main className={`transition-all duration-300 ${
        sidebarCollapsed ? 'ml-16' : 'ml-64'
      }`}>
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
      </main>
    </div>
  );
};

export default Posts;