import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Test() {
  const [username, setUsername] = useState("");
  const [maxPosts, setMaxPosts] = useState("10");
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [rawResponse, setRawResponse] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setData(null);
    setError(null);
    setRawResponse(null);

    try {
      console.log('Starting Instagram reels fetch for:', username, 'max posts:', maxPosts);
      
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
      toast.success('Instagram reels fetched successfully');
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch Instagram reels';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const formatDuration = (duration: number) => {
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <h1 className="text-2xl font-bold mb-6">Instagram Reels Scraper Test</h1>
      
      <Card className="p-6 mb-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium mb-2">
              Instagram Username
            </label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter Instagram username (without @)"
              required
            />
          </div>
          <div>
            <label htmlFor="maxPosts" className="block text-sm font-medium mb-2">
              Number of Reels
            </label>
            <Input
              id="maxPosts"
              type="number"
              min="1"
              max="100"
              value={maxPosts}
              onChange={(e) => setMaxPosts(e.target.value)}
              placeholder="Enter number of reels to fetch"
              required
            />
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Loading..." : "Fetch Reels"}
          </Button>
        </form>
      </Card>

      {error && (
        <Card className="p-6 mb-6 border-red-200 bg-red-50">
          <h2 className="text-xl font-semibold text-red-700 mb-2">Error</h2>
          <pre className="text-red-600 whitespace-pre-wrap">{error}</pre>
        </Card>
      )}

      {data && data.length > 0 && (
        <Card className="p-6 mb-6 overflow-x-auto">
          <h2 className="text-xl font-semibold mb-4">Reels Data</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Thumbnail</TableHead>
                <TableHead>Caption</TableHead>
                <TableHead>Link</TableHead>
                <TableHead>Posted</TableHead>
                <TableHead className="text-right">Duration</TableHead>
                <TableHead className="text-right">Comments</TableHead>
                <TableHead className="text-right">Likes</TableHead>
                <TableHead className="text-right">Views</TableHead>
                <TableHead>Sponsored</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((reel: any) => (
                <TableRow key={reel.id}>
                  <TableCell>
                    {reel.thumbnailUrl && (
                      <img 
                        src={reel.thumbnailUrl} 
                        alt="Reel thumbnail" 
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                    )}
                  </TableCell>
                  <TableCell className="max-w-md">
                    <p className="line-clamp-2">{reel.caption}</p>
                  </TableCell>
                  <TableCell>
                    <a 
                      href={reel.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      View Post
                    </a>
                  </TableCell>
                  <TableCell>{formatDate(reel.timestamp)}</TableCell>
                  <TableCell className="text-right">
                    {reel.videoDuration ? formatDuration(reel.videoDuration) : 'N/A'}
                  </TableCell>
                  <TableCell className="text-right">{reel.commentsCount?.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{reel.likesCount?.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{reel.viewsCount?.toLocaleString()}</TableCell>
                  <TableCell>{reel.isSponsored ? 'Yes' : 'No'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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