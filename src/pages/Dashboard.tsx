import { AccountOverview } from "@/components/AccountOverview";
import ChartsSection from "@/components/dashboard/ChartsSection";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import PostSelectionSection from "@/components/dashboard/PostSelectionSection";
import { useState } from "react";
import type { Post } from "@/components/dashboard/types";

const Dashboard = () => {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
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