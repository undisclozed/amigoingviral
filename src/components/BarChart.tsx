import { Card } from "@/components/ui/card";
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useState } from 'react';
import { Button } from "@/components/ui/button";

const generateTimeData = (interval: '5min' | 'hourly') => {
  const now = new Date();
  const data = [];
  
  if (interval === '5min') {
    // Generate data for last 30 minutes in 5-minute intervals
    for (let i = 6; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 5 * 60000);
      data.push({
        time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        engagement: Number((2 + Math.random() * 3).toFixed(1))
      });
    }
  } else {
    // Generate hourly data for last 6 hours
    for (let i = 6; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60 * 60000);
      data.push({
        time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        engagement: Number((2 + Math.random() * 3).toFixed(1))
      });
    }
  }
  
  return data;
};

export const BarChart = () => {
  const [interval, setInterval] = useState<'5min' | 'hourly'>('5min');
  const [data, setData] = useState(() => generateTimeData('5min'));

  const handleIntervalChange = (newInterval: '5min' | 'hourly') => {
    setInterval(newInterval);
    setData(generateTimeData(newInterval));
  };

  return (
    <Card className="p-6 h-[400px] animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Daily Engagement Rate (%)</h3>
        <div className="flex gap-2">
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
        </div>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="time"
            interval="preserveStartEnd"
            minTickGap={30}
          />
          <YAxis />
          <Tooltip />
          <Bar dataKey="engagement" fill="#E5DEFF" />
        </RechartsBarChart>
      </ResponsiveContainer>
    </Card>
  );
};