import { supabase } from "@/integrations/supabase/client";
import type { AccountMetrics } from "@/types/database";

export const fetchAccountMetrics = async () => {
  const { data, error } = await supabase
    .from('account_metrics')
    .select('*')
    .maybeSingle();

  if (error) throw error;
  return data as AccountMetrics;
};