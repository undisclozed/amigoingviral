import { AccountOverview } from "@/components/AccountOverview";
import ChartsSection from "@/components/dashboard/ChartsSection";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import PostSelectionSection from "@/components/dashboard/PostSelectionSection";
import { AppSidebar } from "@/components/shared/AppSidebar";
import { useState } from "react";
import type { Post } from "@/components/dashboard/types";

const Dashboard = () => {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <div className="min-h-screen flex w-full">
        <AppSidebar onCollapse={setIsCollapsed} />
        <div className={`flex-1 ${isCollapsed ? 'pl-24' : 'pl-72'} p-6 transition-all duration-300`}>
          <div className="max-w-7xl mx-auto space-y-6">
            <DashboardHeader />
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