import { Card } from "@/components/ui/card";
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { day: 'Mon', engagement: 2.8 },
  { day: 'Tue', engagement: 3.2 },
  { day: 'Wed', engagement: 4.1 },
  { day: 'Thu', engagement: 3.8 },
  { day: 'Fri', engagement: 4.5 },
  { day: 'Sat', engagement: 5.2 },
  { day: 'Sun', engagement: 4.9 },
];

export const BarChart = () => {
  return (
    <Card className="p-6 h-[400px] animate-fade-in">
      <h3 className="text-lg font-semibold mb-4">Daily Engagement Rate (%)</h3>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="engagement" fill="#E5DEFF" />
        </RechartsBarChart>
      </ResponsiveContainer>
    </Card>
  );
};