import { AccountOverview } from "@/components/AccountOverview";
import { ViralityScore } from "@/components/ViralityScore";
import { GrowthAnalytics } from "@/components/GrowthAnalytics";
import { WordCloudAnalysis } from "@/components/WordCloudAnalysis";
import { PostComparison } from "@/components/PostComparison";
import CompetitorAnalytics from "@/components/CompetitorAnalytics";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, MapPin, Link as LinkIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAccountMetrics } from "@/hooks/useAccountMetrics";
import { MetricsDisplay } from "@/components/metrics/MetricsDisplay";

const Profile = () => {
  console.log('Profile component rendering');
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { metrics, loading: metricsLoading } = useAccountMetrics();

  useEffect(() => {
    console.log('Profile useEffect running');
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  console.log('Profile state:', { isLoading, user, metricsLoading });

  if (isLoading || metricsLoading) {
    console.log('Profile showing loading state');
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center gap-4 mb-8">
          <Skeleton className="h-24 w-24 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
        
        <div className="space-y-6">
          <Skeleton className="h-[400px] w-full" />
          <Skeleton className="h-[300px] w-full" />
          <Skeleton className="h-[200px] w-full" />
        </div>
      </div>
    );
  }

  console.log('Profile rendering main content');
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-start gap-6 mb-8">
        <div className="h-24 w-24 rounded-full overflow-hidden flex-shrink-0">
          <Avatar className="h-24 w-24">
            <AvatarImage src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7" alt="Sarah's Quest" />
            <AvatarFallback>SQ</AvatarFallback>
          </Avatar>
        </div>
        <div className="space-y-4 flex-grow">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">Sarah's Quest</h1>
              <Badge variant="secondary">Creator</Badge>
            </div>
            <p className="text-gray-600">@sarahsidequest</p>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm text-gray-700">
              Digital creator sharing life's adventures & creative journey 🌟
              Based in San Francisco, CA 🌉
            </p>
            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>San Francisco, CA</span>
              </div>
              <div className="flex items-center gap-1">
                <LinkIcon className="h-4 w-4" />
                <a href="#" className="text-blue-500 hover:underline">sarahsidequest.com</a>
              </div>
              <div className="flex items-center gap-1">
                <CalendarDays className="h-4 w-4" />
                <span>Updated 2 hours ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {metrics && <MetricsDisplay metrics={metrics} />}
      <AccountOverview />
      <PostComparison />
      <GrowthAnalytics />
      <CompetitorAnalytics />
      <WordCloudAnalysis />
      <ViralityScore score={85} avgScore={75} />
    </div>
  );
};

export default Profile;