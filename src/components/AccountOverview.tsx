import { Users, TrendingUp, Target, Zap } from "lucide-react";
import { MetricCard } from "@/components/MetricCard";
import { MetricChartDialog } from "@/components/MetricChartDialog";

export const AccountOverview = () => {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-xl sm:text-2xl font-semibold">Account Overview</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div onClick={() => document.getElementById('followers-dialog')?.click()}>
          <MetricCard
            title="Total Followers"
            value="10,234"
            change={2.5}
            subValue="Growth: +156 this week"
            period="Last 7 days"
            icon={<Users className="h-4 w-4" />}
          />
          <MetricChartDialog
            title="Total Followers"
            metric="followers"
            currentValue="10,234"
            change={2.5}
          />
        </div>
        
        <div onClick={() => document.getElementById('growth-dialog')?.click()}>
          <MetricCard
            title="Account Growth Score"
            value="78"
            change={12}
            subValue="Strong growth trajectory"
            period="Last 30 days"
            icon={<TrendingUp className="h-4 w-4" />}
          />
          <MetricChartDialog
            title="Account Growth Score"
            metric="growth"
            currentValue="78"
            change={12}
          />
        </div>
        
        <div onClick={() => document.getElementById('reached-dialog')?.click()}>
          <MetricCard
            title="Accounts Reached"
            value="45.2K"
            change={5.8}
            subValue="+12.3K from last period"
            period="Last 30 days"
            icon={<Target className="h-4 w-4" />}
          />
          <MetricChartDialog
            title="Accounts Reached"
            metric="reached"
            currentValue="45.2K"
            change={5.8}
          />
        </div>
        
        <div onClick={() => document.getElementById('engaged-dialog')?.click()}>
          <MetricCard
            title="Accounts Engaged"
            value="12.4K"
            change={3.2}
            subValue="+2.1K from last period"
            period="Last 30 days"
            icon={<Zap className="h-4 w-4" />}
          />
          <MetricChartDialog
            title="Accounts Engaged"
            metric="engaged"
            currentValue="12.4K"
            change={3.2}
          />
        </div>
      </div>
    </div>
  );
};