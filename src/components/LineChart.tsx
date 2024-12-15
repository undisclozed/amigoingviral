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
  const [averagePeriod, setAveragePeriod] = useState<'10' | '25' | '50'>('25');
  const [averageData, setAverageData] = useState<any[]>([]);

  useEffect(() => {
    setData(generateTimeData(currentInterval, currentMetric));
    if (showComparison) {
      setComparisonData(generateTimeData(currentInterval, currentMetric, true));
    }
    
    // Generate average data based on selected period
    const avgValue = data.reduce((sum, item) => sum + item.value, 0) / data.length;
    const averagePoints = data.map(item => ({
      date: item.date,
      value: avgValue
    }));
    setAverageData(averagePoints);
  }, [currentInterval, currentMetric, showComparison, averagePeriod]);

  const handleTimeframeChange = (value: string) => {
    setCurrentInterval(value as Interval);
  };

  const handleAveragePeriodChange = (value: string) => {
    setAveragePeriod(value as '10' | '25' | '50');
  };

  return (
    <Card className="w-full h-[400px] flex flex-col">
      <div className="p-6 flex flex-col h-full">
        <div className="flex-none">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Performance Metrics</h3>
            <div className="flex gap-2">
              <Select defaultValue={averagePeriod} onValueChange={handleAveragePeriodChange}>
                <SelectTrigger className="w-[140px] bg-white border-2">
                  <SelectValue placeholder="Average Period" />
                </SelectTrigger>
                <SelectContent className="bg-white border-2 shadow-lg">
                  <SelectItem value="10">Last 10 Posts</SelectItem>
                  <SelectItem value="25">Last 25 Posts</SelectItem>
                  <SelectItem value="50">Last 50 Posts</SelectItem>
                </SelectContent>
              </Select>
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
          </div>
          <div className="mb-6">
            <MetricSelector 
              currentMetric={currentMetric}
              onMetricChange={(metric) => setCurrentMetric(metric)}
            />
          </div>
        </div>
        
        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsLineChart 
              data={data} 
              margin={{ top: 10, right: 30, left: 20, bottom: 20 }}
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
              {averageData.length > 0 && (
                <Line
                  type="monotone"
                  data={averageData}
                  dataKey="value"
                  stroke="#9CA3AF"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                  name={`Average (${averagePeriod} posts)`}
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