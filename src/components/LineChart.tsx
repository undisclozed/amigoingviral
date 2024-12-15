import { Card } from "@/components/ui/card";
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MetricSelector } from './charts/MetricSelector';
import { generateTimeData } from './charts/generateTimeData';
import { LineChartProps, Interval, MetricType, metricLabels } from './charts/types';

export const LineChart = ({ 
  metric = 'views',
  interval = 'daily',
  showComparison = false,
  currentCreator,
  comparisonCreator
}: LineChartProps) => {
  const [currentInterval, setCurrentInterval] = useState<Interval>(interval);
  const [currentMetric, setCurrentMetric] = useState<MetricType>(metric);
  const [data, setData] = useState(() => generateTimeData(interval, metric));
  const [comparisonData, setComparisonData] = useState(() => 
    showComparison ? generateTimeData(interval, metric, true) : []
  );

  useEffect(() => {
    setData(generateTimeData(currentInterval, currentMetric));
    if (showComparison) {
      setComparisonData(generateTimeData(currentInterval, currentMetric, true));
    }
  }, [currentInterval, currentMetric, showComparison]);

  const handleTimeframeChange = (value: string) => {
    setCurrentInterval(value as Interval);
  };

  return (
    <Card className="p-4 h-full w-full">
      <div className="space-y-4">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Performance Metrics</h3>
            <Select defaultValue={currentInterval} onValueChange={handleTimeframeChange}>
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
          <MetricSelector 
            currentMetric={currentMetric}
            onMetricChange={(metric) => setCurrentMetric(metric)}
          />
        </div>
        
        <div className="h-[550px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsLineChart 
              data={data} 
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date"
                interval="preserveStartEnd"
                tick={{ fontSize: 12 }}
                padding={{ left: 10, right: 10 }}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                width={60}
              />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#00F37F" 
                strokeWidth={2}
                dot={{ fill: "#00F37F" }}
                name={currentCreator || metricLabels[currentMetric]}
                isAnimationActive={false}
              />
              {showComparison && comparisonData.length > 0 && (
                <Line 
                  type="monotone" 
                  data={comparisonData}
                  dataKey="value" 
                  stroke="#FF6B6B" 
                  strokeWidth={2}
                  dot={{ fill: "#FF6B6B" }}
                  name={comparisonCreator || "Comparison"}
                  isAnimationActive={false}
                />
              )}
            </RechartsLineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
};