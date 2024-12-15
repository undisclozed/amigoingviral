import { Card } from "@/components/ui/card";
import { Post } from "../dashboard/types";
import { MetricTile } from "./MetricTile";
import { Eye, ThumbsUp, MessageCircle } from "lucide-react";

interface PostsListProps {
  posts: Post[];
  onPostSelect?: (postId: string | null) => void;
}

export const PostsList = ({ posts, onPostSelect }: PostsListProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {posts.map((post) => (
        <Card 
          key={post.id} 
          className="p-4 cursor-pointer hover:shadow-md transition-shadow overflow-hidden" 
          onClick={() => onPostSelect?.(post.id)}
        >
          <div className="aspect-video relative mb-3 overflow-hidden rounded-lg">
            <img 
              src={post.thumbnail} 
              alt="Post thumbnail" 
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-medium line-clamp-2 min-h-[2.5rem]">{post.caption}</h3>
            <div className="text-xs text-gray-500">
              {new Date(post.timestamp).toLocaleDateString()}
            </div>
            <div className="grid grid-cols-3 gap-2 pt-1">
              <MetricTile
                title="Views"
                value={post.metrics.views.toLocaleString()}
                icon={<Eye className="h-4 w-4" />}
              />
              <MetricTile
                title="Likes"
                value={post.metrics.likes.toLocaleString()}
                icon={<ThumbsUp className="h-4 w-4" />}
              />
              <MetricTile
                title="Comments"
                value={post.metrics.comments.toLocaleString()}
                icon={<MessageCircle className="h-4 w-4" />}
              />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};