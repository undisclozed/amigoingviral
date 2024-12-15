import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, ThumbsUp, MessageCircle, Share2, Bookmark, Users } from "lucide-react";
import { MetricTile } from "./MetricTile";
import { PostAnalytics } from "./PostAnalytics";

interface Post {
  id: number;
  thumbnail: string;
  caption: string;
  timestamp: string;
  metrics: {
    views: number;
    likes: number;
    comments: number;
    shares: number;
    saves: number;
    engagement: number;
  };
}

interface PostsListProps {
  posts: Post[];
}

export const PostsList = ({ posts }: PostsListProps) => {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  if (selectedPost) {
    return (
      <div className="space-y-4">
        <button 
          onClick={() => setSelectedPost(null)}
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          ← Back to all posts
        </button>
        <PostAnalytics post={selectedPost} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Posts</h2>
        <p className="text-sm text-gray-600">Total: {posts.length} posts</p>
      </div>
      {posts.map((post) => (
        <Card 
          key={post.id} 
          className="p-4 hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => setSelectedPost(post)}
        >
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
                <MetricTile
                  title="Views"
                  value={post.metrics.views.toLocaleString()}
                  icon={<Eye className="h-4 w-4" />}
                  metric="views"
                />
                <MetricTile
                  title="Likes"
                  value={post.metrics.likes.toLocaleString()}
                  icon={<ThumbsUp className="h-4 w-4" />}
                  metric="likes"
                />
                <MetricTile
                  title="Comments"
                  value={post.metrics.comments.toLocaleString()}
                  icon={<MessageCircle className="h-4 w-4" />}
                  metric="comments"
                />
                <MetricTile
                  title="Shares"
                  value={post.metrics.shares.toLocaleString()}
                  icon={<Share2 className="h-4 w-4" />}
                  metric="shares"
                />
                <MetricTile
                  title="Saves"
                  value={post.metrics.saves.toLocaleString()}
                  icon={<Bookmark className="h-4 w-4" />}
                  metric="saves"
                />
                <MetricTile
                  title="Engagement"
                  value={`${(post.metrics.engagement * 100).toFixed(1)}%`}
                  icon={<Users className="h-4 w-4" />}
                  metric="engagement"
                />
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};