import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth/AuthContext';
import { toast } from 'sonner';
import type { AccountMetrics } from '@/types/database';

export const useAccountMetrics = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<AccountMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

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
        setError(null);
      } catch (error) {
        console.error('Error fetching metrics:', error);
        setError(error as Error);
        toast.error('Failed to load metrics');
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();

    // Set up real-time subscription
    const channel = supabase
      .channel('account-metrics-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'account_metrics',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Real-time metrics update:', payload);
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

  return { metrics, loading, error };
};