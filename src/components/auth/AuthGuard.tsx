import { useAuth } from '@/lib/auth/AuthContext';
import { LoginForm } from '@/components/auth/LoginForm';
import { ProfileForm } from '@/components/auth/ProfileForm';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate, useLocation } from 'react-router-dom';

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard = ({ children }: AuthGuardProps) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isDashboardRoute = location.pathname === '/dashboard';

  // Handle access token in URL
  useEffect(() => {
    const handleHashParams = async () => {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get('access_token');
      
      if (accessToken) {
        console.log('Access token found in URL');
        window.history.replaceState({}, document.title, window.location.pathname);
        
        try {
          const { data: { session }, error } = await supabase.auth.getSession();
          
          if (session && !error) {
            console.log('Session established, navigating to dashboard');
            navigate('/dashboard', { replace: true });
          } else {
            console.error('Session error:', error);
            navigate('/', { replace: true });
          }
        } catch (error) {
          console.error('Auth error:', error);
          navigate('/', { replace: true });
        }
      }
    };

    handleHashParams();
  }, [navigate]);

  // Listen for auth state changes
  useEffect(() => {
    console.log('Setting up auth state listener');
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);
      if (event === 'SIGNED_IN') {
        navigate('/dashboard', { replace: true });
      } else if (event === 'SIGNED_OUT') {
        navigate('/', { replace: true });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  // Check for user profile
  useEffect(() => {
    const getProfile = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching profile for user:', user.id);
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
          throw profileError;
        }

        console.log('Profile data:', profileData);
        setProfile(profileData);

        // Only create metrics if profile exists but metrics don't
        if (profileData) {
          const { data: metricsData, error: metricsError } = await supabase
            .from('account_metrics')
            .select('id')
            .eq('user_id', user.id)
            .single();

          if (metricsError && metricsError.code === 'PGRST116') {
            const { error: insertError } = await supabase
              .from('account_metrics')
              .insert([{
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
              }]);

            if (insertError) {
              console.error('Error creating initial metrics:', insertError);
              toast.error('Failed to initialize metrics');
            }
          }
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    getProfile();
  }, [user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  // If no user, show login form
  if (!user) {
    console.log('No user, showing login form');
    return <LoginForm open={true} onOpenChange={setShowLogin} />;
  }

  // Show profile form only if there's no profile and we're on the dashboard
  if (isDashboardRoute && !profile?.name) {
    console.log('No profile found, showing profile form');
    return <ProfileForm />;
  }

  return <>{children}</>;
};