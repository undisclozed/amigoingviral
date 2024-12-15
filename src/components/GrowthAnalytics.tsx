import { Card } from "@/components/ui/card";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { LineChart } from "./LineChart";
import { useAuth } from "@/lib/auth/AuthContext";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { AccountMetrics } from "@/types/database";

const generateDynamicTips = (score: number): string[] => {
  if (score >= 90) {
    return [
      "Maintain your excellent posting schedule to keep engagement high",
      "Consider mentoring others in your niche to expand influence",
      "Experiment with new content formats while keeping your core style",
      "Look for collaboration opportunities with similar high-performing creators"
    ];
  } else if (score >= 80) {
    return [
      "Increase posting frequency to maintain momentum",
      "Engage more with your audience's comments to boost interaction",
      "Analyze your most successful posts and create similar content",
      "Use trending hashtags relevant to your niche"
    ];
  } else if (score >= 70) {
    return [
      "Post more consistently to improve engagement",
      "Respond to comments within the first hour of posting",
      "Study your analytics to identify peak posting times",
      "Create content series to keep audience coming back"
    ];
  } else {
    return [
      "Establish a regular posting schedule",
      "Focus on creating high-quality, engaging content",
      "Interact with your audience through polls and questions",
      "Research successful content in your niche for inspiration"
    ];
  }
};

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

    // Set up real-time subscription
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

  const growthTips = generateDynamicTips(growthScore);

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-semibold">Growth Score</h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>Your growth score is calculated based on engagement rate, reach, and overall account growth velocity.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="text-2xl font-bold">{growthScore}</div>
        </div>
        
        <div className="flex items-center gap-2 mb-6">
          <span className={`text-sm ${scoreChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {scoreChange >= 0 ? '+' : ''}{scoreChange} points from last period
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="h-[550px]">
              <LineChart 
                metric="growth"
                interval="weekly"
              />
            </div>
          </div>
          
          <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold">Tips to Improve Your Score</h4>
            <ul className="space-y-3">
              {growthTips.map((tip, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0 mt-1.5" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};