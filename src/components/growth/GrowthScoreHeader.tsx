import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";

interface GrowthScoreHeaderProps {
  score: number;
  scoreChange: number;
}

export const GrowthScoreHeader = ({ score, scoreChange }: GrowthScoreHeaderProps) => {
  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-xl font-semibold">Growth Score</h3>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-gray-400" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>Your growth score is calculated based on engagement rate, reach, and overall account growth velocity.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="text-2xl font-bold">{score}</div>
      </div>
      
      <div className="flex items-center gap-2 mb-6">
        <span className={`text-sm ${scoreChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
          {scoreChange >= 0 ? '+' : ''}{scoreChange} points from last period
        </span>
      </div>
    </>
  );
};