import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const PostAnalyticsSkeleton = () => {
  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <Skeleton className="w-16 h-16 rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 mb-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="p-4 rounded-lg bg-gray-50">
              <Skeleton className="h-4 w-16 mb-2" />
              <Skeleton className="h-6 w-24" />
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-4">
        <Skeleton className="h-[400px] w-full" />
      </Card>
    </div>
  );
};