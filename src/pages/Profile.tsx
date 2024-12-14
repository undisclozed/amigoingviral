import { AccountOverview } from "@/components/AccountOverview";
import { ViralityScore } from "@/components/ViralityScore";

const Profile = () => {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center gap-4 mb-8">
          <div className="h-24 w-24 rounded-full bg-gray-200 overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7"
              alt="Profile"
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Sarah Johnson</h1>
            <p className="text-gray-600">@sarahjcreates</p>
            <p className="text-sm text-gray-500 mt-1">Content Creator & Digital Artist</p>
          </div>
        </div>

        <AccountOverview />
        
        <ViralityScore score={85} avgScore={75} />
      </div>
    </div>
  );
};

export default Profile;