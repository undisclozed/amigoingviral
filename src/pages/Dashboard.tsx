import { Users, Heart, Image as ImageIcon, TrendingUp } from "lucide-react";
import { MetricCard } from "@/components/MetricCard";
import { LineChart } from "@/components/LineChart";
import { BarChart } from "@/components/BarChart";
import Sidebar from "@/components/ui/sidebar";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-[#FAFAFA] flex">
      <Sidebar />
      <div className="flex-1 ml-16">
        {/* Header */}
        <header className="border-b bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-xl">Dashboard</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Overview Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard
                title="Followers"
                value="10,234"
                change={2.5}
                icon={<Users size={24} />}
              />
              <MetricCard
                title="Engagement Rate"
                value="4.6%"
                change={-1.2}
                icon={<Heart size={24} />}
              />
              <MetricCard
                title="Total Posts"
                value="486"
                change={12}
                icon={<ImageIcon size={24} />}
              />
              <MetricCard
                title="Profile Views"
                value="2,892"
                change={5.8}
                icon={<TrendingUp size={24} />}
              />
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <LineChart />
            <BarChart />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;