import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { useState } from "react";
import { Post } from "./types";

interface PostSelectionSectionProps {
  selectedPost: Post | null;
  setSelectedPost: (post: Post | null) => void;
}

const PostSelectionSection = ({ selectedPost, setSelectedPost }: PostSelectionSectionProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [creatorHandle, setCreatorHandle] = useState("");

  const mockPosts: Post[] = [
    {
      id: "1",
      username: "@janedoe",
      timestamp: "Sep 24, 11:11 AM",
      caption: "There can only be one winner",
      metrics: {
        views: 17800000,
        likes: 646000,
        comments: 6100,
        shares: 2500,
        saves: 15000,
        engagement: 8.5,
        followsFromPost: 1200,
        averageWatchPercentage: 85.5
      },
      thumbnail: "/placeholder.svg"
    },
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
          comments: Math.floor(Math.random() * 1000),
          shares: Math.floor(Math.random() * 500),
          saves: Math.floor(Math.random() * 2000),
          engagement: Number((Math.random() * 10).toFixed(1)),
          followsFromPost: Math.floor(Math.random() * 200),
          averageWatchPercentage: Number((Math.random() * 40 + 60).toFixed(1))
        },
        thumbnail: "/placeholder.svg"
      },
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
    setCreatorHandle(creatorHandle);
  };

  return (
    <div className="grid grid-cols-1 gap-6">
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
  );
};

export default PostSelectionSection;