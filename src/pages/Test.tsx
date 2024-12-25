import { useState } from "react";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth/AuthContext";
import { TestForm } from "@/components/test/TestForm";
import { ReelsTable } from "@/components/test/ReelsTable";

export default function Test() {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [rawResponse, setRawResponse] = useState<string | null>(null);
  const { user } = useAuth();

  const handleSubmit = async (username: string, maxPosts: string) => {
    setIsLoading(true);
    setData(null);
    setError(null);
    setRawResponse(null);

    try {
      console.log('Starting Instagram reels fetch for:', username, 'max posts:', maxPosts);
      
      // First update the profile with the Instagram account
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ instagram_account: username.replace('@', '') })
        .eq('id', user?.id);

      if (profileError) {
        console.error('Error updating profile:', profileError);
        throw profileError;
      }

      const { data: response, error } = await supabase.functions.invoke('fetch-instagram-data', {
        body: { 
          username: username.replace('@', ''),
          maxPosts: parseInt(maxPosts),
          debug: true 
        }
      });

      if (error) {
        console.error('Edge Function Error:', error);
        throw error;
      }

      console.log('Raw response from edge function:', response);
      
      if (!response) {
        throw new Error('No data returned from API');
      }

      setData(response.data);
      setRawResponse(JSON.stringify(response, null, 2));
      toast.success('Instagram reels fetched and saved successfully');
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch Instagram reels';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <h1 className="text-2xl font-bold mb-6">Instagram Reels Scraper Test</h1>
      
      <TestForm onSubmit={handleSubmit} isLoading={isLoading} />

      {error && (
        <Card className="p-6 mb-6 border-red-200 bg-red-50">
          <h2 className="text-xl font-semibold text-red-700 mb-2">Error</h2>
          <pre className="text-red-600 whitespace-pre-wrap">{error}</pre>
        </Card>
      )}

      {data && data.length > 0 && (
        <Card className="p-6 mb-6 overflow-x-auto">
          <h2 className="text-xl font-semibold mb-4">Reels Data (Saved to Database)</h2>
          <ReelsTable data={data} />
        </Card>
      )}

      {rawResponse && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-2">Raw Response</h2>
          <pre className="bg-gray-100 p-4 rounded-md overflow-auto text-sm">
            {rawResponse}
          </pre>
        </Card>
      )}
    </div>
  );
}