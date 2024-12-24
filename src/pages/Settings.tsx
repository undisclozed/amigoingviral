import { useState } from "react";
import { useAuth } from "@/lib/auth/AuthContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

const Settings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);
  const [instagramAccount, setInstagramAccount] = useState("");

  // Fetch current profile data
  const { data: profile, refetch: refetchProfile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();
      
      if (error) throw error;
      if (data) {
        setInstagramAccount(data.instagram_account || "");
      }
      return data;
    },
    enabled: !!user?.id
  });

  const handleUpdateInstagram = async () => {
    if (!user) return;
    
    setIsUpdating(true);
    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          instagram_account: instagramAccount,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      // Trigger initial Instagram data fetch
      const { error: fetchError } = await supabase.functions.invoke('fetch-instagram-data', {
        body: { username: instagramAccount }
      });

      if (fetchError) {
        console.error('Error fetching initial Instagram data:', fetchError);
        // Don't throw here - we still want to complete profile update
      }

      toast({
        title: "Settings Updated",
        description: "Your Instagram account has been updated successfully.",
      });
      
      refetchProfile();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

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

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Instagram Integration</h2>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-500 block mb-2">
              Instagram Account (@username)
            </label>
            <div className="flex gap-4">
              <Input
                type="text"
                value={instagramAccount}
                onChange={(e) => setInstagramAccount(e.target.value)}
                placeholder="@username"
                className="flex-1"
              />
              <Button 
                onClick={handleUpdateInstagram}
                disabled={isUpdating}
              >
                {isUpdating ? "Updating..." : "Update"}
              </Button>
            </div>
          </div>
          {profile?.instagram_account && (
            <p className="text-sm text-gray-500">
              Currently tracking: @{profile.instagram_account}
            </p>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Settings;