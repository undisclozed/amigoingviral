import { AppSidebar } from "@/components/shared/AppSidebar";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, BarChart2 } from "lucide-react";
import { MetricsOverview } from "@/components/shared/MetricsOverview";

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
  // Add more mock posts as needed
];

const Posts = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-background">
      <div className="min-h-screen flex w-full">
        <AppSidebar onCollapse={setIsCollapsed} />
        <div className={`flex-1 ${isCollapsed ? 'pl-24' : 'pl-72'} p-6 transition-all duration-300`}>
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full"
              />
            </div>

            {/* Account Overview */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Account Overview</h2>
              <MetricsOverview
                type="account"
                metrics={accountMetrics}
                period="Last 30 days"
              />
            </Card>

            {/* Posts List */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Posts</h2>
              {posts.map((post) => (
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
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
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
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Posts;