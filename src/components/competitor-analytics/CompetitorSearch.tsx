import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface CompetitorSearchProps {
  competitorHandle: string;
  onHandleChange: (value: string) => void;
  onSearch: (e: React.FormEvent) => void;
}

export const CompetitorSearch = ({ 
  competitorHandle, 
  onHandleChange, 
  onSearch 
}: CompetitorSearchProps) => {
  return (
    <form onSubmit={onSearch} className="flex gap-2">
      <Input
        placeholder="Enter creator's handle"
        value={competitorHandle}
        onChange={(e) => onHandleChange(e.target.value)}
        className="w-64"
      />
      <Button type="submit">Compare</Button>
    </form>
  );
};