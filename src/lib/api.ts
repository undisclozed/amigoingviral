import { supabase } from "@/integrations/supabase/client";

export interface AccountMetrics {
  avg_views: number;
  avg_likes: number;
  avg_comments: number;
  avg_engagement_rate: number;
  follower_count: number;
}

export const fetchAccountMetrics = async (): Promise<AccountMetrics> => {
  const { data, error } = await supabase
    .from("account_metrics")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return {
    avg_views: data?.avg_views || 0,
    avg_likes: data?.avg_likes || 0,
    avg_comments: data?.avg_comments || 0,
    avg_engagement_rate: data?.avg_engagement_rate || 0,
    follower_count: data?.follower_count || 0,
  };
};