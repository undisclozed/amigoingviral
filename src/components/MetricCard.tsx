import { Card } from "@/components/ui/card";
import { ArrowUp, ArrowDown, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { metricTooltips } from "./charts/types";
import type { MetricType } from "./charts/types";

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  period?: string;
  subValue?: string;
  icon: React.ReactNode;
  metric?: MetricType;
}

export const MetricCard = ({ 
  title, 
  value, 
  change, 
  period, 
  subValue, 
  icon,
  metric 
}: MetricCardProps) => {
  return (
    <Card className="p-3 hover:shadow-lg transition-shadow animate-fade-in cursor-pointer">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1.5">
          <div className="text-gray-600">{icon}</div>
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
        {change !== undefined && (
          <div className={`flex items-center text-xs ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {change >= 0 ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
            <span className="ml-0.5">{Math.abs(change)}%</span>
          </div>
        )}
      </div>
      <div>
        <h3 className="text-xs text-gray-600 font-medium">{title}</h3>
        <p className="text-sm font-bold mt-0.5">{value}</p>
        {subValue && <p className="text-xs text-gray-500 mt-0.5">{subValue}</p>}
        {period && <p className="text-xs text-gray-400 mt-0.5">{period}</p>}
      </div>
    </Card>
  );
};