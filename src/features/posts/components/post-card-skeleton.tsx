import { Skeleton } from "@/components/ui/skeleton";
import UserItemSkeleton from "@/features/users/components/user-item-skeleton";

const PostCardSkeleton = () => {
  return (
    <div className="w-full border rounded-xl px-4 ">
      {/* Header */}
      <div className="flex  items-center justify-between w-full">
        <UserItemSkeleton />
        <div className="pr-3">
          <Skeleton className="size-8 rounded-full" />
        </div>
      </div>

      {/* Body */}
      <div className="p-4 w-full space-y-1">
        <Skeleton className="w-full h-4" />
        <Skeleton className="w-full h-4" />
        <Skeleton className="w-full h-4" />
      </div>

      {/* Attachments */}
      {/* <div className="flex flex-row gap-4 w-full overflow-x-auto p-2">
        <div className="h-64 aspect-[] relative">
          <Image
            src="/images/pic1.jpg"
            fill
            alt="Image1"
            className="object-cover"
          />
        </div>
      </div> */}

      {/* Footer */}
      <div className="py-2">
        <div className="flex flex-row items-center justify-between py-2 px-4">
          <div className="flex items-center  justify-start gap-4">
            <div className="flex flex-row items-center justify-center gap-2">
              <Skeleton className="size-6 rounded-full" />
              <Skeleton className="h-4 w-6" />
            </div>
            <div className="flex flex-row items-center justify-center gap-2">
              <Skeleton className="size-6 rounded-full" />
              <Skeleton className="h-4 w-6" />
            </div>
            <div className="flex flex-row items-center justify-center gap-2">
              <Skeleton className="size-6 rounded-full" />
              <Skeleton className="h-4 w-6" />
            </div>
          </div>
          <div className="flex flex-row items-center justify-center gap-2">
            <Skeleton className="size-6 rounded-full" />
            <Skeleton className="h-4 w-6" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCardSkeleton;
