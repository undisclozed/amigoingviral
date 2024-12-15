import { LineChart } from "../../LineChart";
import { Post } from "../../dashboard/types";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";

interface PostPerformanceChartsProps {
  selectedPost: Post | null;
  selectedComparisonPost: Post | null;
}

export const PostPerformanceCharts = ({ 
  selectedPost, 
  selectedComparisonPost 
}: PostPerformanceChartsProps) => {
  return (
    <>
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-lg font-semibold">Performance Over Time</h3>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Info className="h-4 w-4 text-gray-400" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">
                The blue line shows the average performance across your last 25 posts at the same time since posting.
                This helps you understand how this post is performing compared to your typical content.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="h-[400px]">
        <LineChart 
          metric="engagement"
          interval="hourly"
          showComparison={!!selectedComparisonPost}
          currentCreator="Current Post"
          comparisonCreator={selectedComparisonPost?.caption}
        />
      </div>
    </>
  );
};