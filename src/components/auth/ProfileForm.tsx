import { useState } from 'react';
import { useAuth } from '@/lib/auth/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

export function ProfileForm() {
  const [name, setName] = useState('');
  const [instagramAccount, setInstagramAccount] = useState('');
  const [niche, setNiche] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          name,
          instagram_account: instagramAccount,
          niche
        })
        .eq('id', user.id);

      if (profileError) throw profileError;

      // Trigger initial Instagram data fetch
      const { error: fetchError } = await supabase.functions.invoke('fetch-instagram-data', {
        body: { username: instagramAccount }
      });

      if (fetchError) {
        console.error('Error fetching initial Instagram data:', fetchError);
        // Don't throw here - we still want to complete profile setup
      }

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated and we've started fetching your Instagram data.",
      });
      
      // Refresh the page to show the main app
      window.location.reload();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="mx-auto max-w-sm space-y-6 p-4">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold">Complete Your Profile</h1>
          <p className="text-gray-500">Tell us a bit about yourself to get started</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input
            type="text"
            placeholder="Instagram Account (@username)"
            value={instagramAccount}
            onChange={(e) => setInstagramAccount(e.target.value)}
            required
          />
          <Input
            type="text"
            placeholder="Your Content Niche"
            value={niche}
            onChange={(e) => setNiche(e.target.value)}
            required
          />
          <Button className="w-full" type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Complete Profile"}
          </Button>
        </form>
      </div>
    </div>
  );
}