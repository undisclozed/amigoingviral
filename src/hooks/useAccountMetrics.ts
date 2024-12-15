import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth/AuthContext";
import { toast } from "@/components/ui/use-toast";
import type { AccountMetrics } from "@/types/database";

export const useAccountMetrics = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["accountMetrics", user?.id],
    queryFn: async (): Promise<AccountMetrics | null> => {
      if (!user) return null;

      try {
        // First try to fetch existing metrics
        const { data: existingMetrics, error: fetchError } = await supabase
          .from("account_metrics")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle();

        if (fetchError && fetchError.code !== 'PGRST116') {
          console.error("Error fetching metrics:", fetchError);
          toast({
            title: "Error fetching metrics",
            description: fetchError.message,
            variant: "destructive",
          });
          return null;
        }

        // If no metrics exist, create initial metrics
        if (!existingMetrics) {
          console.log('No metrics found, creating initial metrics');
          const { data: newMetrics, error: insertError } = await supabase
            .from("account_metrics")
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
            }])
            .select()
            .single();

          if (insertError) {
            console.error("Error creating initial metrics:", insertError);
            toast({
              title: "Error creating metrics",
              description: insertError.message,
              variant: "destructive",
            });
            return null;
          }

          return newMetrics;
        }

        return existingMetrics;
      } catch (error) {
        console.error("Error in useAccountMetrics:", error);
        toast({
          title: "Error",
          description: "Failed to fetch account metrics",
          variant: "destructive",
        });
        return null;
      }
    },
    enabled: !!user,
  });
};