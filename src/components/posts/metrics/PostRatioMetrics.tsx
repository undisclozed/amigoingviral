import { MetricTile } from "../MetricTile";
import { Info } from "lucide-react";
import { Post } from "../../dashboard/types";

interface PostRatioMetricsProps {
  post: Post;
}

export const PostRatioMetrics = ({ post }: PostRatioMetricsProps) => {
  const likesToReachRatio = (post.metrics.likes / post.metrics.views) * 100;
  const commentsToReachRatio = (post.metrics.comments / post.metrics.views) * 100;
  const savesToReachRatio = (post.metrics.saves / post.metrics.views) * 100;
  const followsToReachRatio = (post.metrics.followsFromPost / post.metrics.views) * 100;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
      <MetricTile
        title="Likes/Reach"
        value={`${likesToReachRatio.toFixed(1)}%`}
        icon={<Info className="h-4 w-4" />}
      />
      <MetricTile
        title="Comments/Reach"
        value={`${commentsToReachRatio.toFixed(1)}%`}
        icon={<Info className="h-4 w-4" />}
      />
      <MetricTile
        title="Saves/Reach"
        value={`${savesToReachRatio.toFixed(1)}%`}
        icon={<Info className="h-4 w-4" />}
      />
      <MetricTile
        title="Follows/Reach"
        value={`${followsToReachRatio.toFixed(1)}%`}
        icon={<Info className="h-4 w-4" />}
      />
    </div>
  );
};