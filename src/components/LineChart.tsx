import { Card } from "@/components/ui/card";
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useState, useEffect } from 'react';
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Interval = '5min' | 'hourly' | 'daily' | 'weekly' | 'monthly';
type PostMetric = 'views' | 'likes' | 'comments' | 'shares' | 'engagement';
type AccountMetric = 'followers' | 'growth' | 'reached' | 'engaged';
type MetricType = PostMetric | AccountMetric;

const generateTimeData = (interval: Interval, metric: MetricType, isComparison: boolean = false) => {
  const now = new Date();
  const data = [];
  
  const getMetricValue = (base: number) => {
    const multiplier = isComparison ? 0.8 : 1;
    switch(metric) {
      case 'views':
      case 'reached':
        return Math.floor((base + Math.random() * 1000) * multiplier);
      case 'likes':
      case 'growth':
        return Math.floor((base * 0.1 + Math.random() * 100) * multiplier);
      case 'comments':
      case 'followers':
        return Math.floor((base * 0.01 + Math.random() * 50) * multiplier);
      case 'shares':
      case 'engaged':
        return Math.floor((base * 0.05 + Math.random() * 20) * multiplier);
      case 'engagement':
        return Math.floor((base * 0.15 + Math.random() * 5) * multiplier);
      default:
        return 0;
    }
  };

  switch (interval) {
    case '5min':
      for (let i = 11; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 5 * 60000);
        data.push({
          date: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          value: getMetricValue(4000)
        });
      }
      break;

    case 'hourly':
      for (let i = 23; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 60 * 60000);
        data.push({
          date: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          value: getMetricValue(4000)
        });
      }
      break;

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

const metricLabels: Record<MetricType, string> = {
  views: 'Views',
  likes: 'Likes',
  comments: 'Comments',
  shares: 'Shares',
  engagement: 'Engagement Rate',
  followers: 'Followers',
  growth: 'Growth',
  reached: 'Reached',
  engaged: 'Engaged'
};

interface LineChartProps {
  metric?: MetricType;
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

  const handleMetricChange = (newMetric: MetricType) => (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentMetric(newMetric as any);
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
        </div>
        
        <div className="h-[400px] w-full">
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