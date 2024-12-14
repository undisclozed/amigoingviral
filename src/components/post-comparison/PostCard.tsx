import { Badge } from "@/components/ui/badge";
import { formatNumber } from "./utils";
import { PostCardProps } from "./types";

export const PostCard = ({ post }: PostCardProps) => (
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