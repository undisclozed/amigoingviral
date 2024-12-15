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

// Array of realistic tech/social media related images
const postImages = [
  "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
  "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
  "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
  "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
  "https://images.unsplash.com/photo-1485827404703-89b55fcc595e",
  "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
  "https://images.unsplash.com/photo-1531297484001-80022131f5a1",
  "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7",
  "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
  "https://images.unsplash.com/photo-1518770660439-4636190af475",
];

// Generate 34 mock posts
const generateMockPosts = () => {
  return Array.from({ length: 34 }, (_, index) => ({
    id: index + 1,
    thumbnail: postImages[index % postImages.length], // Cycle through available images
    caption: `Post ${index + 1}: ${[
      "Check out this amazing new feature! #tech #innovation",
      "Behind the scenes look at our process #behindthescenes",
      "Quick tip for better productivity #productivity",
      "Exciting announcement coming soon! 🎉",
      "Thank you for all your support! ❤️",
    ][index % 5]}`,
    timestamp: new Date(Date.now() - index * 24 * 60 * 60 * 1000).toISOString(), // Each post 1 day apart
    metrics: {
      views: Math.floor(Math.random() * 50000) + 10000,
      likes: Math.floor(Math.random() * 5000) + 500,
      comments: Math.floor(Math.random() * 200) + 20,
      shares: Math.floor(Math.random() * 100) + 10,
      saves: Math.floor(Math.random() * 300) + 30,
      engagement: (Math.random() * 0.08) + 0.02,
    }
  }));
};

const posts = generateMockPosts();

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