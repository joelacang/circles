import { Skeleton } from "@/components/ui/skeleton";

const CommentSkeleton = () => {
  return (
    <div className="  flex w-full items-start justify-start gap-3">
      <div>
        <Skeleton className="size-8 rounded-full" />
      </div>
      <div className="w-full space-y-2">
        <div className="flex flex-row items-center justify-start gap-2">
          <Skeleton className="h-5 w-18" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div>
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="flex flex-row gap-2">
          <Skeleton className="h-5 w-12" />
          <Skeleton className="h-5 w-12" />
          <Skeleton className="h-5 w-12" />
        </div>
      </div>
    </div>
  );
};

export default CommentSkeleton;
