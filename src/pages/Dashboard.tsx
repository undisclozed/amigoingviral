import { Users, Heart, MessageSquare, Eye, Target, Zap, Info, TrendingUp } from "lucide-react";
import { MetricCard } from "@/components/MetricCard";
import { LineChart } from "@/components/LineChart";
import { BarChart } from "@/components/BarChart";
import { PostComparison } from "@/components/PostComparison";
import { ViralityScore } from "@/components/ViralityScore";
import Sidebar from "@/components/ui/sidebar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { useState } from "react";

interface Post {
  id: string;
  username: string;
  timestamp: string;
  caption: string;
  metrics: {
    views: number;
    likes: number;
    comments: number;
  };
  thumbnail: string;
}

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [creatorHandle, setCreatorHandle] = useState("");
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  // Mock data for demonstration
  const mockPosts: Post[] = [
    {
      id: "1",
      username: "@janedoe",
      timestamp: "Sep 24, 11:11 AM",
      caption: "There can only be one winner",
      metrics: {
        views: 17800000,
        likes: 646000,
        comments: 6100
      },
      thumbnail: "/placeholder.svg"
    },
    // ... keep existing code (other mock posts)
  ];

  const getCreatorPosts = (handle: string): Post[] => {
    return [
      {
        id: "3",
        username: handle,
        timestamp: "Sep 24, 11:11 AM",
        caption: "Creator's post example",
        metrics: {
          views: Math.floor(Math.random() * 1000000),
          likes: Math.floor(Math.random() * 100000),
          comments: Math.floor(Math.random() * 1000)
        },
        thumbnail: "/placeholder.svg"
      },
      // ... keep existing code (other creator posts)
    ];
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const handleCreatorSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real implementation, this would fetch the creator's posts
    setCreatorHandle(creatorHandle);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex">
      <Sidebar />
      <div className="flex-1 ml-0 sm:ml-16 w-full overflow-x-hidden">
        {/* Header */}
        <header className="border-b bg-white mb-8">
          <div className="mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-xl">Dashboard</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="px-4 pb-32">
          {/* Account Overview Section */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-xl sm:text-2xl font-semibold">Account Overview</h2>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">
                      Account Growth Score is calculated based on follower growth, engagement rate,
                      and content consistency over the last 30 days.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard
                title="Total Followers"
                value="10,234"
                change={2.5}
                subValue="Growth: +156 this week"
                period="Last 7 days"
                icon={<Users className="h-4 w-4" />}
              />
              <MetricCard
                title="Account Growth Score"
                value="78"
                change={12}
                subValue="Strong growth trajectory"
                period="Last 30 days"
                icon={<TrendingUp className="h-4 w-4" />}
              />
              <MetricCard
                title="Accounts Reached"
                value="45.2K"
                change={5.8}
                subValue="+12.3K from last period"
                period="Last 30 days"
                icon={<Target className="h-4 w-4" />}
              />
              <MetricCard
                title="Accounts Engaged"
                value="12.4K"
                change={3.2}
                subValue="+2.1K from last period"
                period="Last 30 days"
                icon={<Zap className="h-4 w-4" />}
              />
            </div>
          </div>

          {/* Post Analytics Section */}
          <div className="space-y-8">
            <h2 className="text-xl sm:text-2xl font-semibold">Post Analytics</h2>
            
            {/* Current Post & Post Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Current Post</h4>
                <div className="flex items-center space-x-4">
                  <img src="/placeholder.svg" alt="Current post" className="h-20 w-20 object-cover rounded" />
                  <div>
                    <p className="font-medium">@janedoe</p>
                    <p className="text-sm text-muted-foreground">Sep 24, 11:11 AM</p>
                  </div>
                </div>
                <ViralityScore score={82} avgScore={75} />
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <div className="p-4 border rounded-lg cursor-pointer hover:bg-accent/50 transition-colors">
                    <h4 className="font-medium mb-2">Select Post to Compare</h4>
                    <div className="flex items-center space-x-4">
                      <img src="/placeholder.svg" alt="Select post" className="h-20 w-20 object-cover rounded" />
                      <div>
                        <p className="font-medium">Click to select a post</p>
                        <p className="text-sm text-muted-foreground">Compare metrics with current post</p>
                      </div>
                    </div>
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Select Post</DialogTitle>
                  </DialogHeader>
                  <Tabs defaultValue="your-posts" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="your-posts">Your Posts</TabsTrigger>
                      <TabsTrigger value="other-creator">Other Creator</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="your-posts">
                      <div className="space-y-4">
                        <div className="relative">
                          <Input
                            placeholder="Search your posts"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                          />
                          <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                          {searchQuery && (
                            <button
                              onClick={() => setSearchQuery("")}
                              className="absolute right-3 top-2.5"
                            >
                              <X className="h-5 w-5 text-muted-foreground" />
                            </button>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          {mockPosts
                            .filter(post => 
                              post.username.toLowerCase().includes(searchQuery.toLowerCase())
                            )
                            .map(post => (
                              <div
                                key={post.id}
                                className="flex items-start space-x-4 p-3 hover:bg-accent rounded-lg cursor-pointer"
                                onClick={() => setSelectedPost(post)}
                              >
                                <Avatar className="h-10 w-10">
                                  <img src={post.thumbnail} alt={post.username} />
                                </Avatar>
                                <div className="flex-1 space-y-1">
                                  <p className="font-medium">{post.username}</p>
                                  <p className="text-sm text-muted-foreground">{post.caption}</p>
                                  <div className="flex space-x-4 text-sm text-muted-foreground">
                                    <span>{formatNumber(post.metrics.views)} views</span>
                                    <span>{formatNumber(post.metrics.likes)} likes</span>
                                    <span>{formatNumber(post.metrics.comments)} comments</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="other-creator">
                      <div className="space-y-4">
                        <form onSubmit={handleCreatorSearch} className="space-y-4">
                          <Input
                            placeholder="Enter creator's handle (e.g., @username)"
                            value={creatorHandle}
                            onChange={(e) => setCreatorHandle(e.target.value)}
                          />
                          <Button type="submit" className="w-full">Search Creator</Button>
                        </form>

                        {creatorHandle && (
                          <div className="space-y-2">
                            {getCreatorPosts(creatorHandle).map(post => (
                              <div
                                key={post.id}
                                className="flex items-start space-x-4 p-3 hover:bg-accent rounded-lg cursor-pointer"
                                onClick={() => setSelectedPost(post)}
                              >
                                <Avatar className="h-10 w-10">
                                  <img src={post.thumbnail} alt={post.username} />
                                </Avatar>
                                <div className="flex-1 space-y-1">
                                  <p className="font-medium">{post.username}</p>
                                  <p className="text-sm text-muted-foreground">{post.caption}</p>
                                  <div className="flex space-x-4 text-sm text-muted-foreground">
                                    <span>{formatNumber(post.metrics.views)} views</span>
                                    <span>{formatNumber(post.metrics.likes)} likes</span>
                                    <span>{formatNumber(post.metrics.comments)} comments</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>
                </DialogContent>
              </Dialog>
            </div>

            {/* Engagement Metrics */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Engagement Metrics</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                  title="Engagement Rate"
                  value="4.6%"
                  change={-1.2}
                  subValue="Avg. per post"
                  period="Last 30 days"
                  icon={<Heart className="h-4 w-4" />}
                />
                <MetricCard
                  title="Average Likes"
                  value="892"
                  change={5.8}
                  subValue="Per post"
                  period="Last 30 days"
                  icon={<Heart className="h-4 w-4" />}
                />
                <MetricCard
                  title="Average Comments"
                  value="45"
                  change={2.1}
                  subValue="Per post"
                  period="Last 30 days"
                  icon={<MessageSquare className="h-4 w-4" />}
                />
                <MetricCard
                  title="Average Views"
                  value="2.8K"
                  change={7.5}
                  subValue="Per post"
                  period="Last 30 days"
                  icon={<Eye className="h-4 w-4" />}
                />
              </div>
            </div>

            {/* Post Performance Comparison */}
            <div>
              <PostComparison selectedPost={selectedPost} />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="w-full">
                <LineChart />
              </div>
              <div className="w-full">
                <BarChart />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
