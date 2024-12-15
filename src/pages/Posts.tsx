import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { AccountHeader } from "@/components/posts/AccountHeader";
import { MetricTile } from "@/components/posts/MetricTile";
import { Eye, ThumbsUp, MessageCircle, Share2, Bookmark, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AppSidebar } from "@/components/shared/AppSidebar";

// Mock data for the account
const accountMetrics = {
  views: 245000,
  likes: 12400,
  comments: 860,
  shares: 450,
  saves: 1200,
  engagement: 4.8,
  followers: 10500,
};

// Mock data for posts
const posts = [
  {
    id: 1,
    thumbnail: "/placeholder.svg",
    caption: "Check out this amazing new feature! #tech #innovation",
    timestamp: "2024-03-14T10:00:00Z",
    metrics: {
      views: 24500,
      likes: 1240,
      comments: 86,
      shares: 45,
      saves: 120,
      engagement: 0.048,
    }
  },
  {
    id: 2,
    thumbnail: "/placeholder.svg",
    caption: "Behind the scenes look at our process #behindthescenes",
    timestamp: "2024-03-13T15:30:00Z",
    metrics: {
      views: 18900,
      likes: 980,
      comments: 64,
      shares: 32,
      saves: 95,
      engagement: 0.052,
    }
  },
];

const Posts = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const hasAccount = true;

  if (!hasAccount) {
    return (
      <div className="flex h-screen bg-background">
        <AppSidebar onCollapse={setIsSidebarCollapsed} />
        <main className={`flex-1 transition-all duration-300 ${isSidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
          <div className="flex items-center justify-center h-full">
            <Card className="p-8 max-w-md w-full text-center space-y-4">
              <h2 className="text-2xl font-semibold">No Account Found</h2>
              <p className="text-gray-600">
                Please search for an account or connect your own account to view posts and analytics.
              </p>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search account..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <AppSidebar onCollapse={setIsSidebarCollapsed} />
      <main className={`flex-1 overflow-auto transition-all duration-300 ${isSidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
        <div className="max-w-7xl mx-auto p-6 space-y-6">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Account Overview */}
          <Card className="p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <AccountHeader 
                  accountHandle="@username"
                  profileImage="/placeholder.svg"
                  period="Last 30 days"
                />
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  {posts.length} posts
                </Badge>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2">
                <MetricTile
                  title="Views"
                  value={accountMetrics.views.toLocaleString()}
                  icon={<Eye className="h-4 w-4" />}
                  metric="views"
                />
                <MetricTile
                  title="Likes"
                  value={accountMetrics.likes.toLocaleString()}
                  icon={<ThumbsUp className="h-4 w-4" />}
                  metric="likes"
                />
                <MetricTile
                  title="Comments"
                  value={accountMetrics.comments.toLocaleString()}
                  icon={<MessageCircle className="h-4 w-4" />}
                  metric="comments"
                />
                <MetricTile
                  title="Shares"
                  value={accountMetrics.shares.toLocaleString()}
                  icon={<Share2 className="h-4 w-4" />}
                  metric="shares"
                />
                <MetricTile
                  title="Saves"
                  value={accountMetrics.saves.toLocaleString()}
                  icon={<Bookmark className="h-4 w-4" />}
                  metric="saves"
                />
                <MetricTile
                  title="Followers"
                  value={accountMetrics.followers.toLocaleString()}
                  icon={<Users className="h-4 w-4" />}
                  metric="followers"
                />
                <MetricTile
                  title="Engagement"
                  value={`${accountMetrics.engagement}%`}
                  icon={<Users className="h-4 w-4" />}
                  metric="engagement"
                />
              </div>
            </div>
          </Card>

          {/* Posts List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Posts</h2>
              <p className="text-sm text-gray-600">Total: {posts.length} posts</p>
            </div>
            {posts.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-gray-600">No posts found for this account.</p>
              </Card>
            ) : (
              posts.map((post) => (
                <Card key={post.id} className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="flex gap-4">
                    <div className="w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
                      <img 
                        src={post.thumbnail} 
                        alt={post.caption} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-grow space-y-4">
                      <div>
                        <div className="text-sm text-gray-600">
                          {new Date(post.timestamp).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </div>
                        <p className="line-clamp-2 mt-1">{post.caption}</p>
                      </div>
                      <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
                        <div className="text-center">
                          <div className="text-sm font-medium text-gray-500">Views</div>
                          <div className="text-lg font-semibold">{post.metrics.views.toLocaleString()}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-medium text-gray-500">Likes</div>
                          <div className="text-lg font-semibold">{post.metrics.likes.toLocaleString()}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-medium text-gray-500">Comments</div>
                          <div className="text-lg font-semibold">{post.metrics.comments.toLocaleString()}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-medium text-gray-500">Shares</div>
                          <div className="text-lg font-semibold">{post.metrics.shares.toLocaleString()}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-medium text-gray-500">Saves</div>
                          <div className="text-lg font-semibold">{post.metrics.saves.toLocaleString()}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-medium text-gray-500">Engagement</div>
                          <div className="text-lg font-semibold">{(post.metrics.engagement * 100).toFixed(1)}%</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Posts;
