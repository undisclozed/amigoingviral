import { useEffect, useState } from "react";
import { MetricCard } from "@/components/MetricCard";
import { MetricChartDialog } from "@/components/MetricChartDialog";
import { useAuth } from "@/lib/auth/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Users, Eye, Percent, Users2 } from "lucide-react";
import type { AccountMetrics } from "@/types/database";
import { Skeleton } from "@/components/ui/skeleton";

export const AccountOverview = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<AccountMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchMetrics = async () => {
      try {
        console.log('Fetching metrics for user:', user.id);
        const { data, error } = await supabase
          .from('account_metrics')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.error('Error fetching metrics:', error);
          throw error;
        }

        console.log('Fetched metrics:', data);
        
        if (!data) {
          // If no metrics exist, create initial metrics
          const { data: newMetrics, error: insertError } = await supabase
            .from('account_metrics')
            .insert([
              { 
                user_id: user.id,
                follower_count: 1000,
                follower_growth: 2.5,
                post_count: 10,
                posts_last_period: 3,
                accounts_reached: 5000,
                accounts_engaged: 2500,
                avg_engagement_rate: 8.5,
                avg_likes: 250,
                avg_comments: 15,
                avg_views: 1000,
                growth_score: 75
              }
            ])
            .select()
            .single();

          if (insertError) throw insertError;
          setMetrics(newMetrics);
        } else {
          setMetrics(data);
        }
      } catch (error) {
        console.error('Error in metrics operation:', error);
        toast.error('Failed to load metrics');
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();

    // Set up real-time subscription
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'account_metrics',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Real-time update:', payload);
          if (payload.new) {
            setMetrics(payload.new as AccountMetrics);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const formatMetricValue = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toString();
  };

  if (loading) {
    return (
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-xl sm:text-2xl font-semibold">Account Overview</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-6 rounded-lg border bg-card">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-8 w-32 mb-2" />
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-xl sm:text-2xl font-semibold">Account Overview</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics && (
          <>
            <div onClick={() => document.getElementById('followers-dialog')?.click()}>
              <MetricCard
                title="Followers"
                value={formatMetricValue(metrics.follower_count)}
                change={metrics.follower_growth}
                subValue={`${metrics.follower_growth > 0 ? '+' : ''}${metrics.follower_growth}% growth`}
                period="Last 30 days"
                icon={<Users className="h-4 w-4" />}
                metric="followers"
              />
              <MetricChartDialog
                title="Followers"
                metric="followers"
                currentValue={metrics.follower_count}
                change={metrics.follower_growth}
              />
            </div>

            <div onClick={() => document.getElementById('reach-dialog')?.click()}>
              <MetricCard
                title="Accounts Reached"
                value={formatMetricValue(metrics.accounts_reached)}
                change={((metrics.accounts_reached - metrics.accounts_engaged) / metrics.accounts_engaged) * 100}
                subValue={`${formatMetricValue(metrics.accounts_engaged)} engaged`}
                period="Last 30 days"
                icon={<Eye className="h-4 w-4" />}
                metric="reach"
              />
              <MetricChartDialog
                title="Reach"
                metric="reach"
                currentValue={metrics.accounts_reached}
                change={((metrics.accounts_reached - metrics.accounts_engaged) / metrics.accounts_engaged) * 100}
              />
            </div>

            <div onClick={() => document.getElementById('engagement-dialog')?.click()}>
              <MetricCard
                title="Avg. Engagement"
                value={`${metrics.avg_engagement_rate.toFixed(1)}%`}
                change={0}
                subValue={`${formatMetricValue(metrics.avg_likes)} avg likes`}
                period="Last 30 days"
                icon={<Percent className="h-4 w-4" />}
                metric="engagement"
              />
              <MetricChartDialog
                title="Engagement Rate"
                metric="engagement"
                currentValue={metrics.avg_engagement_rate}
                change={0}
              />
            </div>

            <div onClick={() => document.getElementById('growth-dialog')?.click()}>
              <MetricCard
                title="Growth Score"
                value={metrics.growth_score.toString()}
                change={0}
                subValue="Based on overall performance"
                period="Last 30 days"
                icon={<Users2 className="h-4 w-4" />}
                metric="growth"
              />
              <MetricChartDialog
                title="Growth Score"
                metric="growth"
                currentValue={metrics.growth_score}
                change={0}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};