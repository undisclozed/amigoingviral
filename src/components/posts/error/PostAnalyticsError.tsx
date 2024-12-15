import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";

interface PostAnalyticsErrorProps {
  error: Error | null;
  onRetry: () => void;
}

export const PostAnalyticsError = ({ error, onRetry }: PostAnalyticsErrorProps) => {
  return (
    <Alert variant="destructive" className="mb-4">
      <AlertTitle>Error Loading Analytics</AlertTitle>
      <AlertDescription className="mt-2">
        <p className="mb-4">{error?.message || 'Failed to load post analytics'}</p>
        <Button onClick={onRetry} variant="outline" size="sm">
          <RefreshCcw className="mr-2 h-4 w-4" />
          Retry
        </Button>
      </AlertDescription>
    </Alert>
  );
};