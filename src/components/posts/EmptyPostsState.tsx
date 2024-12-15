import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface EmptyPostsStateProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const EmptyPostsState = ({ searchQuery, setSearchQuery }: EmptyPostsStateProps) => {
  return (
    <div className="flex items-center justify-center h-full">
      <Card className="p-8 max-w-md w-full text-center space-y-4">
        <h2 className="text-2xl font-semibold">No Account Found</h2>
        <p className="text-gray-600">
          Please search for an account or connect your own account to view posts and analytics.
        </p>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search account..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>
    </div>
  );
};