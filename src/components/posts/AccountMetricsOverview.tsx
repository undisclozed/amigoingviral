import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, ThumbsUp, MessageCircle, Share2, Bookmark, Users } from "lucide-react";
import { AccountHeader } from "./AccountHeader";
import { MetricTile } from "./MetricTile";
import { TooltipProvider } from "@/components/ui/tooltip";

interface AccountMetrics {
  views: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  engagement: number;
  followers: number;
}

interface AccountMetricsOverviewProps {
  accountMetrics: AccountMetrics;
  postsCount: number;
  username: string;
}

export const AccountMetricsOverview = ({ accountMetrics, postsCount, username }: AccountMetricsOverviewProps) => {
  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <AccountHeader 
            accountHandle={`@${username}`}
            profileImage="/placeholder.svg"
            period="Last 30 days"
          />
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            {postsCount} posts
          </Badge>
        </div>
        <TooltipProvider>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2">
            <MetricTile
              title="Views"
              value={accountMetrics.views.toLocaleString()}
              icon={<Eye className="h-4 w-4" />}
              metric="views"
            />
            <MetricTile
              title="Likes"
              value={accountMetrics.likes.toLocaleString()}
              icon={<ThumbsUp className="h-4 w-4" />}
              metric="likes"
            />
            <MetricTile
              title="Comments"
              value={accountMetrics.comments.toLocaleString()}
              icon={<MessageCircle className="h-4 w-4" />}
              metric="comments"
            />
            <MetricTile
              title="Shares"
              value={accountMetrics.shares.toLocaleString()}
              icon={<Share2 className="h-4 w-4" />}
              metric="shares"
            />
            <MetricTile
              title="Saves"
              value={accountMetrics.saves.toLocaleString()}
              icon={<Bookmark className="h-4 w-4" />}
              metric="saves"
            />
            <MetricTile
              title="Followers"
              value={accountMetrics.followers.toLocaleString()}
              icon={<Users className="h-4 w-4" />}
              metric="followers"
            />
            <MetricTile
              title="Engagement"
              value={`${accountMetrics.engagement}%`}
              icon={<Users className="h-4 w-4" />}
              metric="engagement"
            />
          </div>
        </TooltipProvider>
      </div>
    </Card>
  );
};