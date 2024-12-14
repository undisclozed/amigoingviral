import { Card } from "@/components/ui/card";
import { LineChart } from "./LineChart";

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

interface PostComparisonProps {
  selectedPost: Post | null;
}

export const PostComparison = ({ selectedPost }: PostComparisonProps) => {
  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Post Performance</h3>
      </div>

      <div className="h-[500px]">
        <LineChart 
          showComparison={!!selectedPost}
          currentCreator="@janedoe"
          comparisonCreator={selectedPost?.username}
        />
      </div>
    </Card>
  );
};