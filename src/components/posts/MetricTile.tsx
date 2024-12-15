import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { metricTooltips } from "../charts/types";
import type { MetricType } from "../charts/types";

interface MetricTileProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  metric?: MetricType;
}

export const MetricTile = ({ title, value, change, icon, metric }: MetricTileProps) => {
  const changeColor = change && change >= 0 ? 'text-green-500' : 'text-red-500';
  
  return (
    <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
      <div className="text-gray-600">{icon}</div>
      <div className="text-center">
        <div className="flex items-center justify-center gap-1">
          <span className="text-xs text-gray-600 truncate max-w-[80px]">{title}</span>
          {metric && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-3 w-3 text-gray-400 hover:text-gray-600 cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">{metricTooltips[metric]}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        <div className="flex items-center justify-center gap-1">
          <span className="font-semibold text-sm truncate max-w-[80px]">{value}</span>
          {change !== undefined && (
            <span className={`text-xs ${changeColor}`}>
              {change >= 0 ? '+' : ''}{change.toFixed(1)}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
};