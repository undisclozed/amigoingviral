import { Users, Heart, Image as ImageIcon, TrendingUp, MessageSquare, Eye, Target, Zap, Info } from "lucide-react";
import { MetricCard } from "@/components/MetricCard";
import { LineChart } from "@/components/LineChart";
import { BarChart } from "@/components/BarChart";
import { PostComparison } from "@/components/PostComparison";
import Sidebar from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-[#FAFAFA] flex">
      <Sidebar />
      <div className="flex-1 ml-0 sm:ml-16 w-full overflow-x-hidden">
        {/* Header */}
        <header className="border-b bg-white mb-8">
          <div className="mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-xl">Dashboard</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="px-4 pb-32">
          {/* Overview Section */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-xl sm:text-2xl font-semibold">Account Overview</h2>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">
                      Account Growth Score is calculated based on follower growth, engagement rate,
                      and content consistency over the last 30 days.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard
                title="Total Followers"
                value="10,234"
                change={2.5}
                subValue="Growth: +156 this week"
                period="Last 7 days"
                icon={<Users className="h-4 w-4" />}
              />
              <MetricCard
                title="Account Growth Score"
                value="78"
                change={12}
                subValue="Strong growth trajectory"
                period="Last 30 days"
                icon={<TrendingUp className="h-4 w-4" />}
              />
              <MetricCard
                title="Accounts Reached"
                value="45.2K"
                change={5.8}
                subValue="+12.3K from last period"
                period="Last 30 days"
                icon={<Target className="h-4 w-4" />}
              />
              <MetricCard
                title="Accounts Engaged"
                value="12.4K"
                change={3.2}
                subValue="+2.1K from last period"
                period="Last 30 days"
                icon={<Zap className="h-4 w-4" />}
              />
            </div>
          </div>

          {/* Engagement Metrics */}
          <div className="mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4">Engagement Metrics</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard
                title="Engagement Rate"
                value="4.6%"
                change={-1.2}
                subValue="Avg. per post"
                period="Last 30 days"
                icon={<Heart className="h-4 w-4" />}
              />
              <MetricCard
                title="Average Likes"
                value="892"
                change={5.8}
                subValue="Per post"
                period="Last 30 days"
                icon={<Heart className="h-4 w-4" />}
              />
              <MetricCard
                title="Average Comments"
                value="45"
                change={2.1}
                subValue="Per post"
                period="Last 30 days"
                icon={<MessageSquare className="h-4 w-4" />}
              />
              <MetricCard
                title="Average Views"
                value="2.8K"
                change={7.5}
                subValue="Per post"
                period="Last 30 days"
                icon={<Eye className="h-4 w-4" />}
              />
            </div>
          </div>

          {/* Post Comparison Section */}
          <div className="mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4">Post Analytics</h2>
            <PostComparison />
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="w-full">
              <LineChart />
            </div>
            <div className="w-full">
              <BarChart />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;