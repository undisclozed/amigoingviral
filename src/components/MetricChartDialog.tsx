import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LineChart } from "@/components/LineChart";
import { useState } from "react";

interface MetricChartDialogProps {
  title: string;
  metric: 'followers' | 'growth' | 'reached' | 'engaged';
  currentValue: string | number;
  change?: number;
}

export const MetricChartDialog = ({ title, metric, currentValue, change }: MetricChartDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger className="hidden" id={`${metric}-dialog`} />
      <DialogContent className="max-w-2xl h-[90vh] overflow-hidden" onPointerDownOutside={() => setIsOpen(false)}>
        <DialogHeader>
          <DialogTitle>{title} Over Time</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 h-full">
          <div className="flex gap-2">
            <Button 
              variant={timeframe === 'daily' ? "default" : "outline"}
              onClick={() => setTimeframe('daily')}
            >
              Daily
            </Button>
            <Button 
              variant={timeframe === 'weekly' ? "default" : "outline"}
              onClick={() => setTimeframe('weekly')}
            >
              Weekly
            </Button>
            <Button 
              variant={timeframe === 'monthly' ? "default" : "outline"}
              onClick={() => setTimeframe('monthly')}
            >
              Monthly
            </Button>
          </div>
          <div className="h-[calc(100%-80px)]">
            <LineChart 
              metric={metric}
              interval={timeframe}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};