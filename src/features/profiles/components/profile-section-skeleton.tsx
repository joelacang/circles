import { Skeleton } from "@/components/ui/skeleton";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

const ProfileSectionSkeleton = () => {
  const isMobile = useIsMobile();
  return (
    <div className="pt-8 px-6 relative">
      <div className="flex w-full flex-col lg:flex-row items-start justify-start gap-8">
        <div className="w-full lg:w-fit flex flex-col gap-4 items-center justify-center lg:justify-start">
          <Skeleton className="size-24 rounded-full" />
          <Skeleton className="h-8 w-22" />
        </div>
        <div className=" w-full  space-y-4">
          <div
            className={cn(
              "flex flex-row ",
              isMobile
                ? " items-center justify-center"
                : "items-start justify-between pt-4"
            )}
          >
            <div className="flex flex-col items-center lg:items-start gap-1">
              <Skeleton className="h-6 w-30" />
              <Skeleton className="h-5 w-24" />
            </div>
            {!isMobile && <Skeleton className="rounded-full size-10" />}
          </div>
          <div className="flex flex-1  w-full">
            <div className="grid grid-cols-3 w-full gap-4 py-4">
              <div className="flex flex-col items-center justify-center gap-2">
                <Skeleton className="h-7 w-5" />
                <Skeleton className="h-6 w-20" />
              </div>
              <div className="flex flex-col items-center justify-center gap-2">
                <Skeleton className="h-7 w-5" />
                <Skeleton className="h-6 w-20" />
              </div>
              <div className="flex flex-col items-center justify-center gap-2">
                <Skeleton className="h-7 w-5" />
                <Skeleton className="h-6 w-20" />
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <div className="flex flex-row items-center justify-center lg:justify-start gap-2">
              <Skeleton className="size-5 rounded-full" />
              <Skeleton className="h-5 w-36" />
            </div>
            <div className="w-full space-y-1">
              <Skeleton className="w-full h-5" />
              <Skeleton className="w-full h-5" />
              <Skeleton className="w-full h-5" />
            </div>
          </div>
        </div>
      </div>

      <div
        className={cn("absolute top-8 right-4", isMobile ? "block" : "hidden")}
      >
        <Skeleton className="rounded-full size-10" />
      </div>
    </div>
  );
};

export default ProfileSectionSkeleton;
