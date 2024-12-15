import { useQuery } from "@tanstack/react-query";
import { MetricsOverview } from "@/components/shared/MetricsOverview";
import { fetchAccountMetrics } from "@/lib/api";
import { useAuth } from "@/lib/auth/AuthContext";

const Profile = () => {
  const { user } = useAuth();
  
  const { data: metrics, isLoading, error } = useQuery({
    queryKey: ['accountMetrics', user?.id],
    queryFn: () => fetchAccountMetrics(user?.id),
    enabled: !!user,
  });

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-[200px]">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error loading metrics</div>;
  }

  if (!metrics) {
    return (
      <div className="text-center p-4">
        <h2 className="text-lg font-semibold">No metrics available</h2>
        <p className="text-gray-500">Start posting to see your metrics here!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <MetricsOverview
        type="account"
        metrics={{
          views: metrics.avg_views || 0,
          likes: metrics.avg_likes || 0,
          comments: metrics.avg_comments || 0,
          engagement: metrics.avg_engagement_rate || 0,
          followers: metrics.follower_count || 0
        }}
        accountHandle={user?.email || "@username"}
      />
    </div>
  );
};

export default Profile;