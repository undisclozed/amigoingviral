interface MetricsProps {
  label: string;
  value: number;
}

const MetricRow = ({ label, value }: MetricsProps) => (
  <div className="flex justify-between text-sm">
    <span className="text-gray-600">{label}</span>
    <span className="font-medium">{value.toLocaleString()}</span>
  </div>
);

interface MetricsComparisonProps {
  userMetrics: Record<string, number>;
  competitorMetrics: Record<string, number>;
  competitorUsername: string;
}

export const MetricsComparison = ({ 
  userMetrics, 
  competitorMetrics, 
  competitorUsername 
}: MetricsComparisonProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <div className="space-y-4">
        <h4 className="font-medium">Your Metrics</h4>
        <div className="space-y-2">
          <MetricRow label="Followers" value={userMetrics.followers} />
          <MetricRow label="Follower Growth" value={userMetrics.followerGrowth} />
          <MetricRow label="Engagement Rate" value={userMetrics.engagementRate} />
          <MetricRow label="Avg. Likes" value={userMetrics.avgLikes} />
          <MetricRow label="Avg. Comments" value={userMetrics.avgComments} />
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="font-medium">Creator Metrics ({competitorUsername})</h4>
        <div className="space-y-2">
          <MetricRow label="Followers" value={competitorMetrics.followers} />
          <MetricRow label="Follower Growth" value={competitorMetrics.followerGrowth} />
          <MetricRow label="Engagement Rate" value={competitorMetrics.engagementRate} />
          <MetricRow label="Avg. Likes" value={competitorMetrics.avgLikes} />
          <MetricRow label="Avg. Comments" value={competitorMetrics.avgComments} />
        </div>
      </div>
    </div>
  );
};