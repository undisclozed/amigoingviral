import { Card } from "@/components/ui/card";
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useState } from 'react';
import { Button } from "@/components/ui/button";

type Interval = '5min' | 'hourly' | 'daily' | 'weekly';

const generateTimeData = (interval: Interval) => {
  const now = new Date();
  const data = [];
  
  switch (interval) {
    case '5min':
      // Generate data for last 30 minutes in 5-minute intervals
      for (let i = 6; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 5 * 60000);
        data.push({
          time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          engagement: Number((2 + Math.random() * 3).toFixed(1))
        });
      }
      break;
      
    case 'hourly':
      // Generate hourly data for last 6 hours
      for (let i = 6; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 60 * 60000);
        data.push({
          time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          engagement: Number((2 + Math.random() * 3).toFixed(1))
        });
      }
      break;
      
    case 'daily':
      // Generate daily data for last 7 days
      for (let i = 6; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 24 * 60 * 60000);
        data.push({
          time: time.toLocaleDateString([], { weekday: 'short' }),
          engagement: Number((2 + Math.random() * 3).toFixed(1))
        });
      }
      break;
      
    case 'weekly':
      // Generate weekly data for last 8 weeks
      for (let i = 7; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 7 * 24 * 60 * 60000);
        data.push({
          time: `Week ${i + 1}`,
          engagement: Number((2 + Math.random() * 3).toFixed(1))
        });
      }
      break;
  }
  
  return data;
};

export const BarChart = () => {
  const [interval, setInterval] = useState<Interval>('5min');
  const [data, setData] = useState(() => generateTimeData('5min'));

  const handleIntervalChange = (newInterval: Interval) => {
    setInterval(newInterval);
    setData(generateTimeData(newInterval));
  };

  return (
    <Card className="p-6 h-[500px]">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-2">
        <h3 className="text-lg font-semibold">Daily Engagement Rate (%)</h3>
        <div className="flex gap-2 flex-wrap">
          <Button 
            variant={interval === '5min' ? "default" : "outline"}
            size="sm"
            onClick={() => handleIntervalChange('5min')}
          >
            5 Min
          </Button>
          <Button 
            variant={interval === 'hourly' ? "default" : "outline"}
            size="sm"
            onClick={() => handleIntervalChange('hourly')}
          >
            Hourly
          </Button>
          <Button 
            variant={interval === 'daily' ? "default" : "outline"}
            size="sm"
            onClick={() => handleIntervalChange('daily')}
          >
            Daily
          </Button>
          <Button 
            variant={interval === 'weekly' ? "default" : "outline"}
            size="sm"
            onClick={() => handleIntervalChange('weekly')}
          >
            Weekly
          </Button>
        </div>
      </div>
      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsBarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="time"
              interval="preserveStartEnd"
              minTickGap={30}
            />
            <YAxis />
            <Tooltip />
            <Bar dataKey="engagement" fill="#00F37F" />
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};