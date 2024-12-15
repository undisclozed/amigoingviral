import { AccountOverview } from "@/components/AccountOverview";
import { ChartsSection } from "@/components/dashboard/ChartsSection";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { PostSelectionSection } from "@/components/dashboard/PostSelectionSection";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <DashboardHeader />
        <AccountOverview />
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          <ChartsSection />
          <PostSelectionSection />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;