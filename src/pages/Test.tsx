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
      if ('error' in result) {
        throw new Error(result.error);
      }

      setData(result as InstagramData);
      toast.success('Instagram data fetched successfully');
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
              <div className="flex items-center space-x-4">
                {data.profilePicUrl && (
                  <img 
                    src={data.profilePicUrl} 
                    alt={`${data.username}'s profile`}
                    className="w-16 h-16 rounded-full"
                  />
                )}
                <div>
                  <div className="font-semibold">@{data.username}</div>
                  <div className="text-sm text-gray-600">{data.biography}</div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="font-semibold">{data.followersCount.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Followers</div>
                </div>
                <div>
                  <div className="font-semibold">{data.followingCount.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Following</div>
                </div>
                <div>
                  <div className="font-semibold">{data.postsCount.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Posts</div>
                </div>
              </div>
            </div>

            {data.latestPosts && data.latestPosts.length > 0 && (
              <>
                <h3 className="text-lg font-semibold mt-4">Recent Posts</h3>
                <div className="grid gap-4">
                  {data.latestPosts.map((post, index) => (
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