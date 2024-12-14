import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

// Mock data for demonstration
const posts = [
  {
    id: "1",
    username: "@sarahjcreates",
    timestamp: "2024-02-15",
    caption: "Morning routine essentials ✨ #lifestyle #morning",
    metrics: {
      views: 150000,
      likes: 15000,
      comments: 800,
    },
    thumbnail: "https://images.unsplash.com/photo-1495001258031-d1b407bc1776",
    engagementScore: 0.25,
    url: "https://instagram.com/p/abc123"
  },
  {
    id: "2",
    username: "@sarahjcreates",
    timestamp: "2024-02-10",
    caption: "Weekend vibes 🌟 #weekend #lifestyle",
    metrics: {
      views: 120000,
      likes: 12000,
      comments: 600,
    },
    thumbnail: "https://images.unsplash.com/photo-1542596594-649edbc13630",
    engagementScore: 0.22,
    url: "https://instagram.com/p/def456"
  },
  {
    id: "3",
    username: "@sarahjcreates",
    timestamp: "2024-02-05",
    caption: "Coffee time ☕️ #coffee #morning",
    metrics: {
      views: 100000,
      likes: 10000,
      comments: 500,
    },
    thumbnail: "https://images.unsplash.com/photo-1459755486867-b55449bb39ff",
    engagementScore: 0.20,
    url: "https://instagram.com/p/ghi789"
  },
  {
    id: "4",
    username: "@sarahjcreates",
    timestamp: "2024-01-20",
    caption: "Quick update #lifestyle",
    metrics: {
      views: 5000,
      likes: 200,
      comments: 10,
    },
    thumbnail: "https://images.unsplash.com/photo-1542596785-11e711e911e0",
    engagementScore: 0.05,
    url: "https://instagram.com/p/jkl012"
  },
  {
    id: "5",
    username: "@sarahjcreates",
    timestamp: "2024-01-15",
    caption: "Testing something new",
    metrics: {
      views: 4000,
      likes: 150,
      comments: 8,
    },
    thumbnail: "https://images.unsplash.com/photo-1542596867-ab5172c27d72",
    engagementScore: 0.04,
    url: "https://instagram.com/p/mno345"
  },
  {
    id: "6",
    username: "@sarahjcreates",
    timestamp: "2024-01-10",
    caption: "Behind the scenes",
    metrics: {
      views: 3000,
      likes: 100,
      comments: 5,
    },
    thumbnail: "https://images.unsplash.com/photo-1542596338-649edbc13630",
    engagementScore: 0.03,
    url: "https://instagram.com/p/pqr678"
  }
];

const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

const PostCard = ({ post }: { post: typeof posts[0] }) => (
  <a 
    href={post.url} 
    target="_blank" 
    rel="noopener noreferrer"
    className="block transition-transform hover:scale-[1.02]"
  >
    <div className="flex gap-4 p-4 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
        <img src={post.thumbnail} alt={post.caption} className="w-full h-full object-cover" />
      </div>
      <div className="flex-grow space-y-2">
        <div className="text-sm text-gray-600">{post.timestamp}</div>
        <p className="text-sm line-clamp-2">{post.caption}</p>
        <div className="flex gap-3">
          <Badge variant="secondary">
            {formatNumber(post.metrics.views)} views
          </Badge>
          <Badge variant="secondary">
            {(post.engagementScore * 100).toFixed(1)}% engagement
          </Badge>
        </div>
      </div>
    </div>
  </a>
);

export const PostComparison = () => {
  // Sort posts by views and engagement score
  const sortedPosts = [...posts].sort((a, b) => {
    const scoreA = a.metrics.views * a.engagementScore;
    const scoreB = b.metrics.views * b.engagementScore;
    return scoreB - scoreA;
  });

  const topPosts = sortedPosts.slice(0, 3);
  const bottomPosts = sortedPosts.slice(-3).reverse();

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <h3 className="text-xl font-semibold">Post Performance Analysis</h3>
        <Tooltip>
          <TooltipTrigger>
            <Info className="h-4 w-4 text-gray-400" />
          </TooltipTrigger>
          <TooltipContent>
            <p className="max-w-xs">Posts are ranked based on a combination of views and engagement score.</p>
          </TooltipContent>
        </Tooltip>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-green-600">Top Performing Posts</h4>
            <Badge variant="secondary" className="bg-green-100 text-green-800">High Impact</Badge>
          </div>
          <div className="space-y-4">
            {topPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-red-600">Underperforming Posts</h4>
            <Badge variant="destructive">Needs Attention</Badge>
          </div>
          <div className="space-y-4">
            {bottomPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};