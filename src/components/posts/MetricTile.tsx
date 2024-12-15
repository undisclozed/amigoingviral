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
    <div className="flex items-center gap-3 p-2 rounded-lg bg-white shadow-sm">
      <div className="text-gray-600">{icon}</div>
      <div>
        <div className="flex items-center gap-1">
          <span className="text-sm text-gray-600">{title}</span>
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
        <div className="flex items-center gap-2">
          <span className="font-semibold">{value}</span>
          {change !== undefined && (
            <span className={`text-xs ${changeColor}`}>
              {change >= 0 ? '+' : ''}{change}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
};