import { useQuery } from "@tanstack/react-query";
import { MetricsOverview } from "@/components/shared/MetricsOverview";
import { fetchAccountMetrics } from "@/lib/api";
import { useAuth } from "@/lib/auth/AuthContext";
import { userMetrics } from "@/components/competitor-analytics/mock-data";
import { toast } from "@/hooks/use-toast";
import { Instagram } from "lucide-react";

const Profile = () => {
  const { user } = useAuth();
  
  const { data: metrics, isLoading } = useQuery({
    queryKey: ['accountMetrics', user?.id],
    queryFn: () => fetchAccountMetrics(user?.id),
    enabled: !!user,
    retry: 1,
    meta: {
      onError: () => {
        console.log("Error fetching metrics, falling back to mock data");
        toast({
          title: "Using demo data",
          description: "Currently displaying sample metrics while we connect to your account.",
        });
      }
    }
  });

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-[200px]">Loading...</div>;
  }

  // Always have displayMetrics defined, either from API or mock data
  const displayMetrics = metrics || {
    avg_views: userMetrics.avgViews,
    avg_likes: userMetrics.avgLikes,
    avg_comments: userMetrics.avgComments,
    avg_engagement_rate: userMetrics.engagementRate,
    follower_count: userMetrics.followers
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Instagram className="h-5 w-5" />
        <h1 className="text-2xl font-bold">Instagram Analytics</h1>
      </div>
      
      <MetricsOverview
        type="account"
        metrics={{
          views: displayMetrics.avg_views || 0,
          likes: displayMetrics.avg_likes || 0,
          comments: displayMetrics.avg_comments || 0,
          engagement: displayMetrics.avg_engagement_rate || 0,
          followers: displayMetrics.follower_count || 0
        }}
        accountHandle={user?.email || "@username"}
      />
    </div>
  );
};

export default Profile;