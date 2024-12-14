import { Button } from "@/components/ui/button";
import { MetricType, metricLabels } from './types';

interface MetricSelectorProps {
  currentMetric: MetricType;
  onMetricChange: (metric: MetricType) => void;
}

export const MetricSelector = ({ currentMetric, onMetricChange }: MetricSelectorProps) => {
  const handleMetricChange = (metric: MetricType) => (e: React.MouseEvent) => {
    e.stopPropagation();
    onMetricChange(metric);
  };

  return (
    <div className="flex gap-2 overflow-x-auto">
      {Object.entries(metricLabels).map(([key, label]) => (
        <Button
          key={key}
          variant={currentMetric === key ? "default" : "outline"}
          onClick={handleMetricChange(key as MetricType)}
          size="sm"
        >
          {label}
        </Button>
      ))}
    </div>
  );
};