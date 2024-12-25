import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

interface TestFormProps {
  onSubmit: (username: string, maxPosts: string) => void;
  isLoading: boolean;
}

export const TestForm = ({ onSubmit, isLoading }: TestFormProps) => {
  const [username, setUsername] = useState("");
  const [maxPosts, setMaxPosts] = useState("10");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(username, maxPosts);
  };

  return (
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
  );
};