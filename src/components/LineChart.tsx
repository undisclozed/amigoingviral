import { Card } from "@/components/ui/card";
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useState, useEffect } from 'react';

type Interval = 'daily' | 'weekly' | 'monthly';
type Metric = 'followers' | 'growth' | 'reached' | 'engaged';

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

const metricLabels: Record<Metric, string> = {
  followers: 'Followers',
  growth: 'Growth Score',
  reached: 'Accounts Reached',
  engaged: 'Accounts Engaged'
};

interface LineChartProps {
  metric?: Metric;
  interval?: Interval;
}

export const LineChart = ({ 
  metric = 'followers',
  interval = 'daily'
}: LineChartProps) => {
  const [data, setData] = useState(() => generateTimeData(interval, metric));

  useEffect(() => {
    setData(generateTimeData(interval, metric));
  }, [interval, metric]);

  return (
    <Card className="p-4 h-full w-full">
      <div className="h-full w-full">
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
              name={metricLabels[metric]}
            />
          </RechartsLineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};