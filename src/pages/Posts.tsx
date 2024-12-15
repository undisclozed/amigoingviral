import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { AppSidebar } from "@/components/shared/AppSidebar";
import { EmptyPostsState } from "@/components/posts/EmptyPostsState";
import { AccountMetricsOverview } from "@/components/posts/AccountMetricsOverview";
import { PostsList } from "@/components/posts/PostsList";

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
          <EmptyPostsState searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <AppSidebar onCollapse={setIsSidebarCollapsed} />
      <main className={`flex-1 overflow-auto transition-all duration-300 ${isSidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
        <div className="max-w-7xl mx-auto p-6 space-y-6">
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

          <AccountMetricsOverview 
            accountMetrics={accountMetrics}
            postsCount={posts.length}
          />

          <PostsList posts={posts} />
        </div>
      </main>
    </div>
  );
};

export default Posts;