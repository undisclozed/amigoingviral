import { useQuery } from "@tanstack/react-query";
import { MetricsOverview } from "@/components/shared/MetricsOverview";
import { useEffect } from "react";
import { fetchAccountMetrics, type AccountMetrics } from "@/lib/api";

const Profile = () => {
  const { data: metrics, isLoading, error } = useQuery<AccountMetrics>({
    queryKey: ['accountMetrics'],
    queryFn: fetchAccountMetrics
  });

  useEffect(() => {
    console.log("Profile component rendering");
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading metrics</div>;
  }

  return (
    <div className="space-y-6">
      <MetricsOverview
        type="account"
        metrics={{
          views: metrics?.avg_views || 0,
          likes: metrics?.avg_likes || 0,
          comments: metrics?.avg_comments || 0,
          engagement: metrics?.avg_engagement_rate || 0,
          followers: metrics?.follower_count || 0
        }}
        accountHandle="@username"
      />
    </div>
  );
};

export default Profile;