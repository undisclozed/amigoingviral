import { Card } from "@/components/ui/card";
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { date: 'Jan', followers: 4000 },
  { date: 'Feb', followers: 4500 },
  { date: 'Mar', followers: 5100 },
  { date: 'Apr', followers: 5400 },
  { date: 'May', followers: 6200 },
  { date: 'Jun', followers: 6800 },
];

export const LineChart = () => {
  return (
    <Card className="p-6 h-[400px] animate-fade-in">
      <h3 className="text-lg font-semibold mb-4">Follower Growth</h3>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line 
            type="monotone" 
            dataKey="followers" 
            stroke="#6E59A5" 
            strokeWidth={2}
            dot={{ fill: "#6E59A5" }}
          />
        </RechartsLineChart>
      </ResponsiveContainer>
    </Card>
  );
};