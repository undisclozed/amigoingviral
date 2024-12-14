import { useState } from "react";
import Sidebar from "@/components/ui/sidebar";
import { AccountOverview } from "@/components/AccountOverview";
import { PostComparison } from "@/components/PostComparison";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import PostSelectionSection from "@/components/dashboard/PostSelectionSection";
import ChartsSection from "@/components/dashboard/ChartsSection";
import { Post } from "@/components/dashboard/types";

const Dashboard = () => {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex">
      <Sidebar />
      <div className="flex-1 ml-0 sm:ml-16 w-full overflow-x-hidden">
        <DashboardHeader />

        <main className="px-4 pb-32">
          <AccountOverview />

          <div className="space-y-8">
            <h2 className="text-xl sm:text-2xl font-semibold">Post Analytics</h2>
            
            <PostSelectionSection 
              selectedPost={selectedPost}
              setSelectedPost={setSelectedPost}
            />

            <div>
              <PostComparison selectedPost={selectedPost} />
            </div>

            <ChartsSection selectedPost={selectedPost} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;