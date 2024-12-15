import { supabase } from "@/integrations/supabase/client";
import type { AccountMetrics } from "@/types/database";

export const fetchAccountMetrics = async (userId?: string) => {
  if (!userId) return null;
  
  const { data, error } = await supabase
    .from('account_metrics')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw error;
  return data as AccountMetrics;
};