import { Card } from "@/components/ui/card";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { LineChart } from "./LineChart";

export const GrowthAnalytics = () => {
  const growthScore = 85;
  const previousScore = 78;
  const scoreChange = growthScore - previousScore;

  const growthTips = [
    "Post consistently to maintain engagement",
    "Engage with your audience through comments",
    "Use relevant hashtags to increase reach",
    "Create content that resonates with your target audience"
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="p-6">
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
          <div className="text-2xl font-bold">{growthScore}</div>
        </div>
        
        <div className="flex items-center gap-2 mb-6">
          <span className={`text-sm ${scoreChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {scoreChange >= 0 ? '+' : ''}{scoreChange} points from last period
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="h-[550px]">
              <LineChart 
                metric="growth"
                interval="weekly"
              />
            </div>
          </div>
          
          <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold">Tips to Improve Your Score</h4>
            <ul className="space-y-3">
              {growthTips.map((tip, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0 mt-1.5" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};