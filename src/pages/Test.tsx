import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setData(null);

    try {
      const response = await fetch(
        'https://api.apify.com/v2/acts/apify~instagram-profile-scraper/run-sync-get-dataset-items?token=' + 
        import.meta.env.VITE_APIFY_API_KEY,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            usernames: [username.replace('@', '')],
            resultsLimit: 5
          })
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error('Failed to fetch Instagram data');
      }

      const result = await response.json();
      console.log('Raw API Response:', result);

      if (!Array.isArray(result) || result.length === 0) {
        throw new Error('No data returned from API');
      }

      setData(result[0]);
      toast.success('Instagram data fetched successfully');
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.message || 'Failed to fetch Instagram data');
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

            <h3 className="text-lg font-semibold mt-4">Recent Posts</h3>
            <div className="grid gap-4">
              {data.posts?.slice(0, 5).map((post, index) => (
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
          </div>
        )}
      </Card>
    </div>
  );
}