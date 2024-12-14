import { Card } from "@/components/ui/card";
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { date: 'Jan', followers: 4000, engagement: 3.2 },
  { date: 'Feb', followers: 4500, engagement: 3.8 },
  { date: 'Mar', followers: 5100, engagement: 4.1 },
  { date: 'Apr', followers: 5400, engagement: 3.9 },
  { date: 'May', followers: 6200, engagement: 4.5 },
  { date: 'Jun', followers: 6800, engagement: 4.2 },
];

export const LineChart = () => {
  return (
    <Card className="p-6 h-[400px] animate-fade-in">
      <h3 className="text-lg font-semibold mb-4">Growth Trends</h3>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip />
          <Line 
            yAxisId="left"
            type="monotone" 
            dataKey="followers" 
            stroke="#6E59A5" 
            strokeWidth={2}
            dot={{ fill: "#6E59A5" }}
            name="Followers"
          />
          <Line 
            yAxisId="right"
            type="monotone" 
            dataKey="engagement" 
            stroke="#00F37F" 
            strokeWidth={2}
            dot={{ fill: "#00F37F" }}
            name="Engagement Rate (%)"
          />
        </RechartsLineChart>
      </ResponsiveContainer>
    </Card>
  );
};