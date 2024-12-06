import { Users, Heart, MessageCircle, TrendingUp } from "lucide-react";
import { MetricCard } from "@/components/MetricCard";
import { LineChart } from "@/components/LineChart";
import { BarChart } from "@/components/BarChart";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Instagram Analytics</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Total Followers"
            value="6,842"
            change={2.5}
            icon={<Users size={24} />}
          />
          <MetricCard
            title="Likes"
            value="12,094"
            change={3.8}
            icon={<Heart size={24} />}
          />
          <MetricCard
            title="Comments"
            value="1,723"
            change={-1.2}
            icon={<MessageCircle size={24} />}
          />
          <MetricCard
            title="Engagement Rate"
            value="4.2%"
            change={0.8}
            icon={<TrendingUp size={24} />}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <LineChart />
          <BarChart />
        </div>
      </div>
    </div>
  );
};

export default Index;