import { Users, TrendingUp, Target, Zap, MessageCircle, Eye, ThumbsUp, BarChart2 } from "lucide-react";
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
        
        <div onClick={() => document.getElementById('posts-dialog')?.click()}>
          <MetricCard
            title="Total Posts"
            value="342"
            change={8.3}
            subValue="+12 posts this month"
            period="Last 30 days"
            icon={<BarChart2 className="h-4 w-4" />}
          />
          <MetricChartDialog
            title="Total Posts"
            metric="posts"
            currentValue="342"
            change={8.3}
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

        <div onClick={() => document.getElementById('engagement-rate-dialog')?.click()}>
          <MetricCard
            title="Avg Engagement Rate"
            value="4.8%"
            change={0.5}
            subValue="Higher than last period"
            period="Last 30 days"
            icon={<TrendingUp className="h-4 w-4" />}
          />
          <MetricChartDialog
            title="Average Engagement Rate"
            metric="engagement"
            currentValue="4.8%"
            change={0.5}
          />
        </div>

        <div onClick={() => document.getElementById('likes-dialog')?.click()}>
          <MetricCard
            title="Avg Likes per Post"
            value="856"
            change={-1.2}
            subValue="-24 from last period"
            period="Last 30 days"
            icon={<ThumbsUp className="h-4 w-4" />}
          />
          <MetricChartDialog
            title="Average Likes per Post"
            metric="likes"
            currentValue="856"
            change={-1.2}
          />
        </div>

        <div onClick={() => document.getElementById('comments-dialog')?.click()}>
          <MetricCard
            title="Avg Comments per Post"
            value="42"
            change={2.8}
            subValue="+5 from last period"
            period="Last 30 days"
            icon={<MessageCircle className="h-4 w-4" />}
          />
          <MetricChartDialog
            title="Average Comments per Post"
            metric="comments"
            currentValue="42"
            change={2.8}
          />
        </div>

        <div onClick={() => document.getElementById('views-dialog')?.click()}>
          <MetricCard
            title="Avg Views per Post"
            value="2.3K"
            change={4.5}
            subValue="+245 from last period"
            period="Last 30 days"
            icon={<Eye className="h-4 w-4" />}
          />
          <MetricChartDialog
            title="Average Views per Post"
            metric="views"
            currentValue="2.3K"
            change={4.5}
          />
        </div>
      </div>
    </div>
  );
};