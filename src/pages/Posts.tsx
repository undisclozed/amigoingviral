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

// Array of baking-related images
const postImages = [
  "https://images.unsplash.com/photo-1483695028939-5bb13f8648b0", // Freshly baked bread
  "https://images.unsplash.com/photo-1509440159596-0249088772ff", // Colorful macarons
  "https://images.unsplash.com/photo-1517686469429-8bdb88b9f907", // Birthday cake
  "https://images.unsplash.com/photo-1497534446932-c925b458314e", // Chocolate chip cookies
  "https://images.unsplash.com/photo-1516684732162-798a0062be99", // Croissants
  "https://images.unsplash.com/photo-1488477181946-6428a0291777", // Cupcakes
  "https://images.unsplash.com/photo-1464195244916-405fa0a82545", // Pie
  "https://images.unsplash.com/photo-1509440159596-0249088772ff", // Pastries
  "https://images.unsplash.com/photo-1556471013-0001958d2f12", // Sourdough
  "https://images.unsplash.com/photo-1486427944299-d1955d23e34d", // Muffins
];

// Generate 34 mock posts
const generateMockPosts = () => {
  return Array.from({ length: 34 }, (_, index) => ({
    id: index + 1,
    thumbnail: postImages[index % postImages.length],
    caption: `Post ${index + 1}: ${[
      "Sunday baking session! Made these rustic sourdough loaves with locally milled flour 🌾 #HomeBaker #BreadBaking",
      "First attempt at French macarons - getting better with each batch! Vanilla bean filling inside 🤍 #BakingJourney",
      "Weekly meal prep: Whole grain sandwich loaves and some cinnamon rolls for good measure 🍞 #BreadBaking",
      "Testing a new pie crust recipe today - all butter, extra flaky! 🥧 #BakingFromScratch",
      "Simple pleasures: Fresh croissants and coffee for breakfast ☕️ #MorningBakes",
    ][index % 5]}`,
    timestamp: new Date(Date.now() - index * 24 * 60 * 60 * 1000).toISOString(),
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