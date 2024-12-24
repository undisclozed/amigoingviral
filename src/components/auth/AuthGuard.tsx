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
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isDashboardRoute = location.pathname === '/dashboard';

  // Handle session initialization and refresh
  useEffect(() => {
    const initSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Session error:', error);
          await signOut();
          navigate('/', { replace: true });
          return;
        }

        if (!session) {
          setLoading(false);
          return;
        }

        // Set up session refresh
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange(async (event, session) => {
          console.log('Auth state changed:', event);
          if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
            navigate('/', { replace: true });
          } else if (event === 'SIGNED_IN' && session) {
            navigate('/dashboard', { replace: true });
          } else if (event === 'TOKEN_REFRESHED') {
            console.log('Token refreshed successfully');
          }
        });

        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Auth initialization error:', error);
        toast.error('Authentication error. Please sign in again.');
        await signOut();
        navigate('/', { replace: true });
      } finally {
        setLoading(false);
      }
    };

    initSession();
  }, [navigate, signOut]);

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
          .maybeSingle();

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
            .maybeSingle();

          if (!metricsData && !metricsError) {
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