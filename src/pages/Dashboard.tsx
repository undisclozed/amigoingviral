import { AccountOverview } from "@/components/AccountOverview";
import ChartsSection from "@/components/dashboard/ChartsSection";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import PostSelectionSection from "@/components/dashboard/PostSelectionSection";
import { useState } from "react";
import type { Post } from "@/components/dashboard/types";

const Dashboard = () => {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  return (
    <div className="space-y-6 bg-background rounded-lg p-6 shadow-sm">
      <DashboardHeader />
      <AccountOverview />
      <PostSelectionSection
        selectedPost={selectedPost}
        setSelectedPost={setSelectedPost}
      />
      <ChartsSection />
    </div>
  );
};

export default Dashboard;