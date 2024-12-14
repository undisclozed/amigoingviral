import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ViralityScoreProps {
  score: number;
  avgScore: number;
}

export const ViralityScore = ({ score, avgScore }: ViralityScoreProps) => {
  const difference = score - avgScore;
  const performanceText = difference > 0 
    ? `Performing ${difference.toFixed(0)}% above average`
    : difference < 0 
      ? `Performing ${Math.abs(difference).toFixed(0)}% below average`
      : 'Performing at average';

  return (
    <div className="mt-2 p-3 bg-gray-50 rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-lg">Virality Score</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-gray-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">
                  The virality score is calculated based on engagement rate, reach, and growth velocity compared to similar posts at the same time since posting.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <span className="text-2xl font-bold">{score}</span>
      </div>
      <div className="text-sm text-gray-600">
        <div>Average score at this time: {avgScore}</div>
        <div className={`${difference > 0 ? 'text-green-600' : difference < 0 ? 'text-red-600' : 'text-gray-600'}`}>
          {performanceText}
        </div>
      </div>
    </div>
  );
};