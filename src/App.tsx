import { AuthProvider } from '@/lib/auth/AuthContext';
import { useAuth } from '@/lib/auth/AuthContext';
import { LoginForm } from '@/components/auth/LoginForm';
import { ProfileForm } from '@/components/auth/ProfileForm';
import { Toaster } from '@/components/ui/toaster';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AccountOverview } from '@/components/AccountOverview';
import { GrowthAnalytics } from '@/components/GrowthAnalytics';
import ChartsSection from '@/components/dashboard/ChartsSection';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

const queryClient = new QueryClient();

function AppContent() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getProfile() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        setProfile(data);
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setLoading(false);
      }
    }

    getProfile();
  }, [user]);

  if (!user) {
    return <LoginForm />;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  // If profile is incomplete (no instagram_account or name), show profile form
  if (!profile?.instagram_account || !profile?.name) {
    return <ProfileForm />;
  }

  return (
    <div>
      <AccountOverview />
      <GrowthAnalytics />
      <ChartsSection />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppContent />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;