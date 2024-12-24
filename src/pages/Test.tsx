import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface InstagramPost {
  id: string;
  caption: string;
  likesCount: number;
  commentsCount: number;
  timestamp: string;
  url: string;
}

interface InstagramData {
  username: string;
  biography: string;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  profilePicUrl: string;
  latestPosts: InstagramPost[];
}

export default function Test() {
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setData(null);
    setError(null);

    try {
      console.log('Fetching data for username:', username);
      
      const { data: result, error } = await supabase.functions.invoke('fetch-instagram-data', {
        body: { username: username.replace('@', '') }
      });

      if (error) {
        console.error('Edge Function Error:', error);
        throw error;
      }

      console.log('Raw response from edge function:', result);

      if (!result) {
        throw new Error('No data returned from API');
      }

      // Check if the response contains an error
      if ('error' in result) {
        throw new Error(result.error);
      }

      setData(result);
      toast.success('Instagram data fetched successfully');
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch Instagram data';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Instagram Data Test</h1>
      
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium mb-2">
              Instagram Username
            </label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter Instagram username"
              required
            />
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Loading..." : "Fetch Data"}
          </Button>
        </form>

        {error && (
          <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-md">
            {error}
          </div>
        )}

        {data && (
          <div className="mt-6 space-y-4">
            <h2 className="text-xl font-semibold">Raw Profile Data</h2>
            <pre className="bg-gray-100 p-4 rounded-md overflow-auto">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        )}
      </Card>
    </div>
  );
}