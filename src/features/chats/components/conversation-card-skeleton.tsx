import { Skeleton } from "@/components/ui/skeleton";

const ConversationCardSkeleton = () => {
  return (
    <div className="p-2 flex flex-row w-full items-start justify-start gap-4">
      <Skeleton className="size-10 rounded-full shrink-0" />
      <div className="space-y-2 w-full">
        <Skeleton className="h-5 w-24" />
        <div className="w-full space-y-1">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>

        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  );
};

export default ConversationCardSkeleton;
