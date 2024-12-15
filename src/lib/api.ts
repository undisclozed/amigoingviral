import { supabase } from "@/integrations/supabase/client";
import type { AccountMetrics } from "@/types/database";

export const fetchAccountMetrics = async (userId?: string) => {
  if (!userId) {
    console.log("No user ID provided to fetchAccountMetrics");
    return null;
  }
  
  try {
    const { data, error } = await supabase
      .from('account_metrics')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.error("Error fetching metrics:", error);
      throw error;
    }

    return data as AccountMetrics;
  } catch (error) {
    console.error("Error in fetchAccountMetrics:", error);
    throw error;
  }
};