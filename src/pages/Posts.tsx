import { AppSidebar } from "@/components/shared/AppSidebar";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import {
  BarChart2,
  Clock,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Users,
} from "lucide-react";
import { MetricCard } from "@/components/MetricCard";
import { LineChart } from "@/components/LineChart";

// Mock data - in a real app, this would come from an API
const postMetrics = {
  views: 24500,
  likes: 1240,
  comments: 86,
  shares: 45,
  saves: 120,
  reach: 18000,
  engagement: 4.8,
  duration: "00:45",
  watchPercentage: 68,
  followsFromPost: 25,
};

const Posts = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState("24h");

  return (
    <div className="min-h-screen bg-background">
      <div className="min-h-screen flex w-full">
        <AppSidebar onCollapse={setIsCollapsed} />
        <div className={`flex-1 ${isCollapsed ? 'pl-24' : 'pl-72'} p-6 transition-all duration-300`}>
          <div className="max-w-7xl mx-auto space-y-6">
            <header className="border-b bg-white mb-8">
              <div className="mx-auto px-4 py-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xl">Post Analytics</span>
                  </div>
                </div>
              </div>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard
                title="Views"
                value={postMetrics.views.toLocaleString()}
                change={12}
                icon={<BarChart2 className="h-4 w-4" />}
                period="Last 24 hours"
                metric="views"
              />
              <MetricCard
                title="Likes"
                value={postMetrics.likes.toLocaleString()}
                change={8}
                icon={<Heart className="h-4 w-4" />}
                period="Last 24 hours"
                metric="likes"
              />
              <MetricCard
                title="Comments"
                value={postMetrics.comments.toLocaleString()}
                change={-3}
                icon={<MessageCircle className="h-4 w-4" />}
                period="Last 24 hours"
                metric="comments"
              />
              <MetricCard
                title="Shares"
                value={postMetrics.shares.toLocaleString()}
                change={15}
                icon={<Share2 className="h-4 w-4" />}
                period="Last 24 hours"
                metric="shares"
              />
              <MetricCard
                title="Saves"
                value={postMetrics.saves.toLocaleString()}
                change={5}
                icon={<Bookmark className="h-4 w-4" />}
                period="Last 24 hours"
                metric="saves"
              />
              <MetricCard
                title="Reach"
                value={postMetrics.reach.toLocaleString()}
                change={10}
                icon={<Users className="h-4 w-4" />}
                period="Last 24 hours"
                metric="reached"
              />
              <MetricCard
                title="Engagement Rate"
                value={`${postMetrics.engagement}%`}
                change={2}
                icon={<BarChart2 className="h-4 w-4" />}
                period="Last 24 hours"
                metric="engagement"
              />
              <MetricCard
                title="Watch Time"
                value={postMetrics.duration}
                subValue={`${postMetrics.watchPercentage}% completed`}
                icon={<Clock className="h-4 w-4" />}
                metric="duration"
              />
            </div>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Performance Over Time</h3>
              <div className="h-[400px]">
                <LineChart 
                  metric="engagement"
                  interval="hourly"
                />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Posts;