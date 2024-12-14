import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X, Info } from "lucide-react";
import { LineChart } from "./LineChart";
import { Avatar } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Post {
  id: string;
  username: string;
  timestamp: string;
  caption: string;
  metrics: {
    views: number;
    likes: number;
    comments: number;
    viralityScore: number;
    avgScoreAtTime: number;
  };
  thumbnail: string;
}

export const PostComparison = () => {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [comparePost, setComparePost] = useState<Post | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data for demonstration
  const mockPosts: Post[] = [
    {
      id: "1",
      username: "@janedoe",
      timestamp: "Sep 24, 11:11 AM",
      caption: "There can only be one winner, and I thinkthis caption can grow to two line max if more",
      metrics: {
        views: 17800000,
        likes: 646000,
        comments: 6100,
        viralityScore: 82,
        avgScoreAtTime: 75
      },
      thumbnail: "/placeholder.svg"
    },
    {
      id: "2",
      username: "@cristiano",
      timestamp: "Sep 24, 11:11 AM",
      caption: "There can only be one winner, and I thinkthis caption can grow to two line max if more",
      metrics: {
        views: 25000000,
        likes: 1200000,
        comments: 8500,
        viralityScore: 95,
        avgScoreAtTime: 75
      },
      thumbnail: "/placeholder.svg"
    }
  ];

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const renderViralityScore = (score: number, avgScore: number) => {
    const difference = score - avgScore;
    const performanceText = difference > 0 
      ? `Performing ${difference.toFixed(0)}% above average`
      : difference < 0 
        ? `Performing ${Math.abs(difference).toFixed(0)}% below average`
        : 'Performing at average';

    return (
      <div className="mt-2 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-lg">Virality Score</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    The virality score is calculated based on engagement rate, reach, and growth velocity compared to similar posts at the same time since posting.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <span className="text-2xl font-bold">{score}</span>
        </div>
        <div className="text-sm text-gray-600">
          <div>Average score at this time: {avgScore}</div>
          <div className={`${difference > 0 ? 'text-green-600' : difference < 0 ? 'text-red-600' : 'text-gray-600'}`}>
            {performanceText}
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Post Performance</h3>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Select Post to Compare</Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Select Post</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="relative">
                <Input
                  placeholder="Search by username"
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
                      onClick={() => setComparePost(post)}
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
                        {renderViralityScore(post.metrics.viralityScore, post.metrics.avgScoreAtTime)}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="space-y-4">
          <div className="p-4 border rounded-lg">
            <h4 className="font-medium mb-2">Current Post</h4>
            <div className="flex items-center space-x-4">
              <Avatar className="h-10 w-10">
                <img src="/placeholder.svg" alt="Current post" />
              </Avatar>
              <div>
                <p className="font-medium">@janedoe</p>
                <p className="text-sm text-muted-foreground">Sep 24, 11:11 AM</p>
              </div>
            </div>
            {renderViralityScore(mockPosts[0].metrics.viralityScore, mockPosts[0].metrics.avgScoreAtTime)}
          </div>
        </div>

        {comparePost && (
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Comparison Post</h4>
              <div className="flex items-center space-x-4">
                <Avatar className="h-10 w-10">
                  <img src={comparePost.thumbnail} alt={comparePost.username} />
                </Avatar>
                <div>
                  <p className="font-medium">{comparePost.username}</p>
                  <p className="text-sm text-muted-foreground">{comparePost.timestamp}</p>
                </div>
              </div>
              {renderViralityScore(comparePost.metrics.viralityScore, comparePost.metrics.avgScoreAtTime)}
            </div>
          </div>
        )}
      </div>

      <div className="h-[500px]">
        <LineChart />
      </div>
    </Card>
  );
};