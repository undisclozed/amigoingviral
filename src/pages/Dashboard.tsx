import { AccountOverview } from "@/components/AccountOverview";
import ChartsSection from "@/components/dashboard/ChartsSection";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import PostSelectionSection from "@/components/dashboard/PostSelectionSection";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/shared/AppSidebar";
import { useState } from "react";
import type { Post } from "@/components/dashboard/types";

const Dashboard = () => {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          <div className="flex-1 p-6">
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
      </SidebarProvider>
    </div>
  );
};

export default Dashboard;