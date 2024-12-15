import CompetitorAnalytics from "@/components/CompetitorAnalytics";
import { GrowthAnalytics } from "@/components/GrowthAnalytics";
import { WordCloudAnalysis } from "@/components/WordCloudAnalysis";
import { PostComparison } from "@/components/PostComparison";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { AccountOverview } from "@/components/AccountOverview";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/lib/auth/AuthContext";

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      {/* Account Header */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <Avatar className="h-24 w-24">
            <AvatarImage src="/placeholder.svg" alt={user?.email || 'User'} />
            <AvatarFallback>{user?.email?.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">{user?.email}</h1>
            <p className="text-muted-foreground">
              Digital creator sharing insights and analytics about social media growth
            </p>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <span>📍 San Francisco, CA</span>
              <span>🔗 instagram.com/username</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Account Metrics Overview */}
      <AccountOverview />

      {/* Analytics Dashboard */}
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold tracking-tight">Analytics Dashboard</h2>
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search analytics..."
              className="pl-10"
            />
          </div>
        </div>

        <div className="grid gap-6">
          <div className="animate-fade-in">
            <GrowthAnalytics />
          </div>
          
          <div className="animate-fade-in [animation-delay:200ms]">
            <CompetitorAnalytics />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="animate-fade-in [animation-delay:400ms]">
              <WordCloudAnalysis />
            </div>
            <div className="animate-fade-in [animation-delay:400ms]">
              <PostComparison />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;