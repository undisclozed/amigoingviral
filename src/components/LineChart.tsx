import { Card } from "@/components/ui/card";
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";

type Interval = '5min' | 'hourly' | 'daily' | 'weekly';
type Metric = 'views' | 'likes' | 'comments' | 'shares' | 'engagement' | 'followers' | 'growth' | 'reached' | 'engaged';

const generateTimeData = (interval: Interval, metric: Metric) => {
  const now = new Date();
  const data = [];
  
  const getMetricValue = (base: number) => {
    switch(metric) {
      case 'followers':
        return Math.floor(base + Math.random() * 1000);
      case 'growth':
        return Math.floor(50 + Math.random() * 50);
      case 'reached':
        return Math.floor(base * 1.5 + Math.random() * 5000);
      case 'engaged':
        return Math.floor(base * 0.3 + Math.random() * 1000);
      case 'views':
        return Math.floor(base + Math.random() * 3000);
      case 'likes':
        return Math.floor((base / 10) + Math.random() * 300);
      case 'comments':
        return Math.floor((base / 100) + Math.random() * 30);
      case 'shares':
        return Math.floor((base / 50) + Math.random() * 60);
      case 'engagement':
        return (3 + Math.random() * 2).toFixed(1);
    }
  };

  switch (interval) {
    case '5min':
      for (let i = 6; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 5 * 60000);
        data.push({
          date: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          currentPost: getMetricValue(4000),
          comparisonPost: getMetricValue(3000)
        });
      }
      break;
      
    case 'hourly':
      for (let i = 6; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 60 * 60000);
        data.push({
          date: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          currentPost: getMetricValue(4000),
          comparisonPost: getMetricValue(3000)
        });
      }
      break;
      
    case 'daily':
      for (let i = 6; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 24 * 60 * 60000);
        data.push({
          date: time.toLocaleDateString([], { weekday: 'short' }),
          currentPost: getMetricValue(4000),
          comparisonPost: getMetricValue(3000)
        });
      }
      break;
      
    case 'weekly':
      for (let i = 7; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 7 * 24 * 60 * 60000);
        data.push({
          date: `Week ${i + 1}`,
          currentPost: getMetricValue(4000),
          comparisonPost: getMetricValue(3000)
        });
      }
      break;
  }
  
  return data;
};

const metricLabels: Record<Metric, string> = {
  views: 'Views',
  likes: 'Likes',
  comments: 'Comments',
  shares: 'Shares',
  engagement: 'Engagement Rate %',
  followers: 'Followers',
  growth: 'Growth Score',
  reached: 'Accounts Reached',
  engaged: 'Accounts Engaged'
};

interface LineChartProps {
  currentCreator?: string;
  comparisonCreator?: string;
  metric?: Metric;
  interval?: Interval;
}

export const LineChart = ({ 
  currentCreator = "@janedoe", 
  comparisonCreator = "@cristiano",
  metric = 'views',
  interval: initialInterval = '5min'
}: LineChartProps) => {
  const [currentInterval, setCurrentInterval] = useState<Interval>(initialInterval);
  const [data, setData] = useState(() => generateTimeData(initialInterval, metric));

  const handleIntervalChange = (newInterval: Interval) => {
    setCurrentInterval(newInterval);
    setData(generateTimeData(newInterval, metric));
  };

  return (
    <Card className="p-4 h-[500px] w-full overflow-hidden mb-8">
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <h3 className="text-lg font-semibold">Performance Over Time</h3>
          <div className="flex flex-wrap gap-2">
            <Button 
              variant={currentInterval === '5min' ? "default" : "outline"}
              size="sm"
              onClick={() => handleIntervalChange('5min')}
            >
              5 Min
            </Button>
            <Button 
              variant={currentInterval === 'hourly' ? "default" : "outline"}
              size="sm"
              onClick={() => handleIntervalChange('hourly')}
            >
              Hourly
            </Button>
            <Button 
              variant={currentInterval === 'daily' ? "default" : "outline"}
              size="sm"
              onClick={() => handleIntervalChange('daily')}
            >
              Daily
            </Button>
            <Button 
              variant={currentInterval === 'weekly' ? "default" : "outline"}
              size="sm"
              onClick={() => handleIntervalChange('weekly')}
            >
              Weekly
            </Button>
          </div>
        </div>
      </div>
      <div className="h-[350px] w-full">
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
            <Legend />
            <Line 
              type="monotone" 
              dataKey="currentPost" 
              stroke="#6E59A5" 
              strokeWidth={2}
              dot={{ fill: "#6E59A5" }}
              name={`${metricLabels[metric]} (${currentCreator})`}
            />
            <Line 
              type="monotone" 
              dataKey="comparisonPost" 
              stroke="#FF6B6B" 
              strokeWidth={2}
              dot={{ fill: "#FF6B6B" }}
              name={`${metricLabels[metric]} (${comparisonCreator})`}
            />
          </RechartsLineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};