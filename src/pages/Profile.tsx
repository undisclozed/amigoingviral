import { AccountOverview } from "@/components/AccountOverview";
import { ViralityScore } from "@/components/ViralityScore";
import { GrowthAnalytics } from "@/components/GrowthAnalytics";
import { WordCloudAnalysis } from "@/components/WordCloudAnalysis";
import { PostComparison } from "@/components/PostComparison";
import CompetitorAnalytics from "@/components/CompetitorAnalytics";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { CalendarDays } from "lucide-react";
import { useState, useEffect } from "react";
import SidebarProvider from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/shared/AppSidebar";

const Profile = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCompetitor, setSelectedCompetitor] = useState<string | null>(null);

  useEffect(() => {
    // Simulate loading state
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <SidebarProvider>
          <div className="min-h-screen flex w-full">
            <AppSidebar />
            <div className="flex-1 pl-64 p-6"> {/* Added pl-64 for sidebar width offset */}
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
            </div>
          </div>
        </SidebarProvider>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          <div className="flex-1 pl-64 p-6"> {/* Added pl-64 for sidebar width offset */}
            <div className="max-w-7xl mx-auto space-y-6">
              <div className="flex flex-col md:flex-row md:items-start gap-6 mb-8 animate-fade-in">
                <div className="h-24 w-24 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                  <img
                    src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7"
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="space-y-4 flex-grow">
                  <div>
                    <div className="flex items-center gap-3">
                      <h1 className="text-2xl font-bold">Sarah Johnson</h1>
                      <Badge variant="secondary">Creator</Badge>
                    </div>
                    <p className="text-gray-600">@sarahjcreates</p>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm text-gray-700">Content Creator & Digital Artist specializing in lifestyle content and creative tutorials. Based in San Francisco, CA.</p>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <CalendarDays className="h-4 w-4" />
                      <span>Profile last updated: 2 hours ago</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="bg-primary-light rounded-full px-4 py-1">
                      <span className="font-medium">342</span> Total Posts
                    </div>
                    <div className="bg-primary-light rounded-full px-4 py-1">
                      <span className="font-medium">156</span> Posts this month
                    </div>
                    <div className="bg-primary-light rounded-full px-4 py-1">
                      <span className="font-medium">4.8%</span> Avg. Engagement
                    </div>
                  </div>
                </div>
              </div>

              <AccountOverview />
              <PostComparison />
              <GrowthAnalytics />
              <CompetitorAnalytics />
              <WordCloudAnalysis />
              <ViralityScore score={85} avgScore={75} />
            </div>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default Profile;