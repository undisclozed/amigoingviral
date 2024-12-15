import { Card } from "@/components/ui/card";
import { LineChart } from "./LineChart";
import { useAuth } from "@/lib/auth/AuthContext";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { GrowthTips } from "./growth/GrowthTips";
import { GrowthScoreHeader } from "./growth/GrowthScoreHeader";
import type { AccountMetrics } from "@/types/database";

export const GrowthAnalytics = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<AccountMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchMetrics = async () => {
      try {
        const { data, error } = await supabase
          .from('account_metrics')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error) throw error;
        setMetrics(data);
      } catch (error) {
        console.error('Error fetching metrics:', error);
        toast.error('Failed to load growth analytics');
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();

    const channel = supabase
      .channel('growth-analytics-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'account_metrics',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Real-time growth update:', payload);
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

  if (loading || !metrics) {
    return (
      <div className="space-y-6 animate-pulse">
        <Card className="p-6">
          <div className="h-[600px] bg-gray-100 rounded-lg"></div>
        </Card>
      </div>
    );
  }

  const growthScore = metrics.growth_score;
  const previousScore = growthScore - 5; // We'll implement historical tracking later
  const scoreChange = growthScore - previousScore;

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="p-6">
        <GrowthScoreHeader score={growthScore} scoreChange={scoreChange} />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="h-[550px]">
              <LineChart 
                metric="growth"
                interval="weekly"
              />
            </div>
          </div>
          
          <GrowthTips score={growthScore} />
        </div>
      </Card>
    </div>
  );
};
