import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface InstagramData {
  username: string;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  profileUrl: string;
  profilePicUrl: string;
  bio: string;
  posts: Array<{
    url: string;
    type: string;
    caption: string;
    commentsCount: number;
    likesCount: number;
    timestamp: string;
  }>;
}

export default function Test() {
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<InstagramData | null>(null);
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
      if (Array.isArray(result) && result[0]?.error) {
        throw new Error(result[0].errorDescription || result[0].error);
      }

      // If we have valid data, set it
      if (Array.isArray(result) && result.length > 0) {
        setData(result[0]);
        toast.success('Instagram data fetched successfully');
      } else {
        throw new Error('Invalid data format received');
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = error.message || 'Failed to fetch Instagram data';
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
            <h2 className="text-xl font-semibold">Profile Data</h2>
            <div className="grid gap-4">
              <div>
                <strong>Username:</strong> {data.username}
              </div>
              <div>
                <strong>Followers:</strong> {data.followersCount}
              </div>
              <div>
                <strong>Following:</strong> {data.followingCount}
              </div>
              <div>
                <strong>Posts:</strong> {data.postsCount}
              </div>
              <div>
                <strong>Bio:</strong> {data.bio}
              </div>
            </div>

            {data.posts && data.posts.length > 0 && (
              <>
                <h3 className="text-lg font-semibold mt-4">Recent Posts</h3>
                <div className="grid gap-4">
                  {data.posts.slice(0, 5).map((post, index) => (
                    <Card key={index} className="p-4">
                      <div className="space-y-2">
                        <div><strong>Caption:</strong> {post.caption}</div>
                        <div><strong>Likes:</strong> {post.likesCount}</div>
                        <div><strong>Comments:</strong> {post.commentsCount}</div>
                        <div><strong>Posted:</strong> {new Date(post.timestamp).toLocaleString()}</div>
                      </div>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}