import { useAuth } from "@/lib/auth/AuthContext";
import { Card } from "@/components/ui/card";

const Settings = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold mb-6">Account Settings</h1>
      
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Email</label>
            <p className="mt-1">{user?.email}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">User ID</label>
            <p className="mt-1">{user?.id}</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Settings;