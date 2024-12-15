import { AccountOverview } from "@/components/AccountOverview";
import ChartsSection from "@/components/dashboard/ChartsSection";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import PostSelectionSection from "@/components/dashboard/PostSelectionSection";
import { AppSidebar } from "@/components/shared/AppSidebar";
import { MetricsOverview } from "@/components/shared/MetricsOverview";
import { useState } from "react";
import type { Post } from "@/components/dashboard/types";

const Dashboard = () => {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Mock data - this would come from your API
  const currentMetrics = {
    views: 245000,
    likes: 12400,
    comments: 856,
    engagement: 0.048,
    followers: 10234
  };

  const previousMetrics = {
    views: 235000,
    likes: 11800,
    comments: 820,
    engagement: 0.045,
    followers: 9800
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="min-h-screen flex w-full">
        <AppSidebar onCollapse={setIsCollapsed} />
        <div className={`flex-1 ${isCollapsed ? 'pl-24' : 'pl-72'} p-6 transition-all duration-300`}>
          <div className="max-w-7xl mx-auto space-y-6">
            <DashboardHeader />
            <MetricsOverview 
              type="account"
              metrics={currentMetrics}
              previousPeriodMetrics={previousMetrics}
            />
            <AccountOverview />
            <PostSelectionSection
              selectedPost={selectedPost}
              setSelectedPost={setSelectedPost}
            />
            <ChartsSection />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;