import { Badge } from "@/components/ui/badge";
import { PostCard } from "./PostCard";
import { PostSectionProps } from "./types";

export const PostSection = ({ 
  title, 
  posts, 
  badgeText, 
  badgeVariant = "secondary",
  badgeClassName 
}: PostSectionProps) => (
  <div className="space-y-4">
    <div className="flex items-center gap-2">
      <h4 className="font-semibold text-green-600">{title}</h4>
      <Badge variant={badgeVariant} className={badgeClassName}>
        {badgeText}
      </Badge>
    </div>
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  </div>
);