import { useAuth } from '@/lib/auth/AuthContext';
import { LoginForm } from '@/components/auth/LoginForm';
import { ProfileForm } from '@/components/auth/ProfileForm';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard = ({ children }: AuthGuardProps) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);
      if (event === 'SIGNED_IN') {
        navigate('/dashboard');
      } else if (event === 'SIGNED_OUT') {
        navigate('/');
      }
    });

    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session?.user?.id);
      if (!session) {
        setLoading(false);
        navigate('/');
      }
    });

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    console.log('No user, showing login form');
    return <LoginForm open={true} onOpenChange={setShowLogin} />;
  }

  if (!profile?.instagram_account || !profile?.name) {
    console.log('No profile info, showing profile form');
    return <ProfileForm />;
  }

  return <>{children}</>;
};