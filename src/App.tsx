import { AuthProvider } from '@/lib/auth/AuthContext';
import { useAuth } from '@/lib/auth/AuthContext';
import { LoginForm } from '@/components/auth/LoginForm';
import { ProfileForm } from '@/components/auth/ProfileForm';
import { Toaster } from '@/components/ui/toaster';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AccountOverview } from '@/components/AccountOverview';
import { GrowthAnalytics } from '@/components/GrowthAnalytics';
import ChartsSection from '@/components/dashboard/ChartsSection';
import { AppSidebar } from '@/components/shared/AppSidebar';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const queryClient = new QueryClient();

function AppContent() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        console.log('User signed in:', session?.user);
      }
    });

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    async function getProfile() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching profile for user:', user.id);
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
          throw error;
        }
        
        console.log('Profile data:', data);
        setProfile(data);

        // Check if account metrics exist for the user
        const { data: metricsData, error: metricsError } = await supabase
          .from('account_metrics')
          .select('id')
          .eq('user_id', user.id)
          .single();

        if (metricsError && metricsError.code === 'PGRST116') {
          // No metrics found, create initial metrics
          const { error: insertError } = await supabase
            .from('account_metrics')
            .insert([
              {
                user_id: user.id,
                follower_count: 0,
                follower_growth: 0,
                post_count: 0,
                posts_last_period: 0,
                accounts_reached: 0,
                accounts_engaged: 0,
                avg_engagement_rate: 0,
                avg_likes: 0,
                avg_comments: 0,
                avg_views: 0,
                growth_score: 0
              }
            ]);

          if (insertError) {
            console.error('Error creating initial metrics:', insertError);
            toast.error('Failed to initialize metrics');
          }
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    }

    getProfile();
  }, [user]);

  if (!user) {
    console.log('No user, showing login form');
    return <LoginForm />;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!profile?.instagram_account || !profile?.name) {
    console.log('No profile info, showing profile form');
    return <ProfileForm />;
  }

  console.log('Rendering main app content');
  return (
    <div className="flex h-screen">
      <AppSidebar />
      <main className="flex-1 overflow-y-auto p-8 ml-64">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route
            path="/dashboard"
            element={
              <div>
                <AccountOverview />
                <GrowthAnalytics />
                <ChartsSection />
              </div>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <AppContent />
          <Toaster />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;