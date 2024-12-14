import { Card } from "@/components/ui/card";
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useState, useEffect } from 'react';
import { Button } from "./ui/button";

type Interval = 'daily' | 'weekly' | 'monthly';
type PostMetric = 'views' | 'likes' | 'comments' | 'shares' | 'engagement';

const generateTimeData = (interval: Interval, metric: PostMetric, isComparison: boolean = false) => {
  const now = new Date();
  const data = [];
  
  const getMetricValue = (base: number) => {
    const multiplier = isComparison ? 0.8 : 1; // Comparison data slightly lower for demo
    switch(metric) {
      case 'views':
        return Math.floor((base + Math.random() * 1000) * multiplier);
      case 'likes':
        return Math.floor((base * 0.1 + Math.random() * 100) * multiplier);
      case 'comments':
        return Math.floor((base * 0.01 + Math.random() * 50) * multiplier);
      case 'shares':
        return Math.floor((base * 0.05 + Math.random() * 20) * multiplier);
      case 'engagement':
        return Math.floor((base * 0.15 + Math.random() * 5) * multiplier);
      default:
        return 0;
    }
  };

  switch (interval) {
    case 'daily':
      for (let i = 6; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 24 * 60 * 60000);
        data.push({
          date: time.toLocaleDateString([], { weekday: 'short' }),
          value: getMetricValue(4000)
        });
      }
      break;
      
    case 'weekly':
      for (let i = 7; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 7 * 24 * 60 * 60000);
        data.push({
          date: `Week ${8-i}`,
          value: getMetricValue(4000)
        });
      }
      break;

    case 'monthly':
      for (let i = 11; i >= 0; i--) {
        const time = new Date(now.getFullYear(), now.getMonth() - i, 1);
        data.push({
          date: time.toLocaleDateString([], { month: 'short' }),
          value: getMetricValue(4000)
        });
      }
      break;
  }
  
  return data;
};

const metricLabels: Record<PostMetric, string> = {
  views: 'Views',
  likes: 'Likes',
  comments: 'Comments',
  shares: 'Shares',
  engagement: 'Engagement Rate'
};

interface LineChartProps {
  metric?: PostMetric;
  interval?: Interval;
  showComparison?: boolean;
  currentCreator?: string;
  comparisonCreator?: string;
}

export const LineChart = ({ 
  metric = 'views',
  interval = 'daily',
  showComparison = false,
  currentCreator,
  comparisonCreator
}: LineChartProps) => {
  const [currentInterval, setCurrentInterval] = useState<Interval>(interval);
  const [currentMetric, setCurrentMetric] = useState<PostMetric>(metric);
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

  const handleTimeframeChange = (newInterval: Interval) => (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentInterval(newInterval);
  };

  const handleMetricChange = (newMetric: PostMetric) => (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentMetric(newMetric);
  };

  return (
    <Card className="p-4 h-full w-full">
      <div className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
          <div className="flex gap-2">
            <Button 
              variant={currentInterval === 'daily' ? "default" : "outline"}
              onClick={handleTimeframeChange('daily')}
              size="sm"
            >
              Daily
            </Button>
            <Button 
              variant={currentInterval === 'weekly' ? "default" : "outline"}
              onClick={handleTimeframeChange('weekly')}
              size="sm"
            >
              Weekly
            </Button>
            <Button 
              variant={currentInterval === 'monthly' ? "default" : "outline"}
              onClick={handleTimeframeChange('monthly')}
              size="sm"
            >
              Monthly
            </Button>
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {Object.entries(metricLabels).map(([key, label]) => (
              <Button
                key={key}
                variant={currentMetric === key ? "default" : "outline"}
                onClick={handleMetricChange(key as PostMetric)}
                size="sm"
              >
                {label}
              </Button>
            ))}
          </div>
        </div>
        
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsLineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date"
                interval="preserveStartEnd"
                minTickGap={30}
              />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#00F37F" 
                strokeWidth={2}
                dot={{ fill: "#00F37F" }}
                name={currentCreator || metricLabels[currentMetric]}
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
                />
              )}
            </RechartsLineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
};