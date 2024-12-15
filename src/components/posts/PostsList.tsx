import { Card } from "@/components/ui/card";
import { Post } from "../dashboard/types";

interface PostsListProps {
  posts: Post[];
  onPostSelect?: (postId: number | null) => void;
}

export const PostsList = ({ posts, onPostSelect }: PostsListProps) => {
  return (
    <div className="grid grid-cols-1 gap-4">
      {posts.map((post) => (
        <Card key={post.id} className="p-4 cursor-pointer" onClick={() => onPostSelect?.(post.id)}>
          <img src={post.thumbnail} alt="Post thumbnail" className="w-full h-48 object-cover rounded-lg mb-2" />
          <h3 className="text-lg font-semibold">{post.caption}</h3>
          <p className="text-sm text-gray-500">{new Date(post.timestamp).toLocaleDateString()}</p>
        </Card>
      ))}
    </div>
  );
};