import { BarChart, LineChart } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
              <div className="flex items-center gap-4">
                <Button variant="outline">@username</Button>
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
              <Card className="p-6 animate-fade-in">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-500">Followers</h3>
                  <span className="text-xs text-green-500">+2.5%</span>
                </div>
                <p className="text-2xl font-semibold">10,234</p>
              </Card>
              <Card className="p-6 animate-fade-in [animation-delay:100ms]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-500">Engagement Rate</h3>
                  <span className="text-xs text-red-500">-1.2%</span>
                </div>
                <p className="text-2xl font-semibold">4.6%</p>
              </Card>
              <Card className="p-6 animate-fade-in [animation-delay:200ms]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-500">Total Posts</h3>
                  <span className="text-xs text-green-500">+12</span>
                </div>
                <p className="text-2xl font-semibold">486</p>
              </Card>
              <Card className="p-6 animate-fade-in [animation-delay:300ms]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-500">Avg. Likes</h3>
                  <span className="text-xs text-green-500">+5.8%</span>
                </div>
                <p className="text-2xl font-semibold">892</p>
              </Card>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold">Follower Growth</h3>
                <LineChart className="text-gray-400" size={20} />
              </div>
              <div className="h-[300px] flex items-center justify-center text-gray-500">
                Chart will be implemented here
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold">Engagement Rate</h3>
                <BarChart className="text-gray-400" size={20} />
              </div>
              <div className="h-[300px] flex items-center justify-center text-gray-500">
                Chart will be implemented here
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;