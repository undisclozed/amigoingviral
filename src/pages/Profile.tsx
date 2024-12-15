import { useQuery } from "@tanstack/react-query";
import { MetricsOverview } from "@/components/shared/MetricsOverview";
import { fetchAccountMetrics } from "@/lib/api";
import { useAuth } from "@/lib/auth/AuthContext";

const Profile = () => {
  const { user } = useAuth();
  
  const { data: metrics, isLoading, error } = useQuery({
    queryKey: ['accountMetrics', user?.id],
    queryFn: fetchAccountMetrics,
    enabled: !!user,
  });

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-[200px]">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error loading metrics</div>;
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
        accountHandle={user?.email || "@username"}
      />
    </div>
  );
};

export default Profile;