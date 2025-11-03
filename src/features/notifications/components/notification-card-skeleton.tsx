import { Skeleton } from "@/components/ui/skeleton";
import { Dice1 } from "lucide-react";

const NotificationCardSkeleton = () => {
  return (
    <div className="px-4 flex flex-row gap-4">
      <Skeleton className="size-12 rounded-full" />
      <div className="space-y-1">
        <Skeleton className="h-5 w-44" />
        <Skeleton className="h-4 w-20" />
      </div>
    </div>
  );
};

export default NotificationCardSkeleton;
