import { Card } from "@/components/ui/card";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PostSection } from "./post-comparison/PostSection";
import { posts } from "./post-comparison/mock-data";
import { calculatePostScore } from "./post-comparison/utils";

export const PostComparison = () => {
  // Sort posts by views and engagement score
  const sortedPosts = [...posts].sort((a, b) => {
    const scoreA = calculatePostScore(a.metrics.views, a.engagementScore);
    const scoreB = calculatePostScore(b.metrics.views, b.engagementScore);
    return scoreB - scoreA;
  });

  const topPosts = sortedPosts.slice(0, 3);
  const bottomPosts = sortedPosts.slice(-3).reverse();

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <h3 className="text-xl font-semibold">Post Performance Analysis</h3>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Info className="h-4 w-4 text-gray-400" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">Posts are ranked based on a combination of views and engagement score.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <PostSection
          title="Top Performing Posts"
          posts={topPosts}
          badgeText="High Impact"
          badgeClassName="bg-green-100 text-green-800"
        />
        <PostSection
          title="Underperforming Posts"
          posts={bottomPosts}
          badgeText="Needs Attention"
          badgeVariant="destructive"
        />
      </div>
    </Card>
  );
};