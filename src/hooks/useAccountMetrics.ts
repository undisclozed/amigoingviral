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
        const { data, error } = await supabase
          .from("account_metrics")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (error) {
          console.error("Error fetching metrics:", error);
          toast({
            title: "Error fetching metrics",
            description: error.message,
            variant: "destructive",
          });
          return null;
        }

        return data;
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