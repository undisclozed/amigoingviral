import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Interval } from "./types";

interface ChartControlsProps {
  currentInterval: Interval;
  averagePeriod: string;
  onTimeframeChange: (value: string) => void;
  onAveragePeriodChange: (value: string) => void;
}

export const ChartControls = ({
  currentInterval,
  averagePeriod,
  onTimeframeChange,
  onAveragePeriodChange
}: ChartControlsProps) => {
  return (
    <div className="flex gap-2">
      <Select defaultValue={averagePeriod} onValueChange={onAveragePeriodChange}>
        <SelectTrigger className="w-[140px] bg-white border-2">
          <SelectValue placeholder="Average Period" />
        </SelectTrigger>
        <SelectContent className="bg-white border-2 shadow-lg">
          <SelectItem value="10">Last 10 Posts</SelectItem>
          <SelectItem value="25">Last 25 Posts</SelectItem>
          <SelectItem value="50">Last 50 Posts</SelectItem>
        </SelectContent>
      </Select>
      <Select defaultValue={currentInterval} onValueChange={onTimeframeChange}>
        <SelectTrigger className="w-[120px] bg-white border-2">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-white border-2 shadow-lg">
          <SelectItem value="5min">5 Minutes</SelectItem>
          <SelectItem value="hourly">Hourly</SelectItem>
          <SelectItem value="daily">Daily</SelectItem>
          <SelectItem value="weekly">Weekly</SelectItem>
          <SelectItem value="monthly">Monthly</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};