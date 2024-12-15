import { CompetitorAnalytics } from "@/components/CompetitorAnalytics";
import { GrowthAnalytics } from "@/components/GrowthAnalytics";
import { WordCloudAnalysis } from "@/components/WordCloudAnalysis";
import { PostComparison } from "@/components/PostComparison";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const Profile = () => {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Analytics Dashboard</h1>
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
        <GrowthAnalytics />
        <CompetitorAnalytics />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <WordCloudAnalysis />
          <PostComparison />
        </div>
      </div>
    </div>
  );
};

export default Profile;