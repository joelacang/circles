import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface Props {
  isSender?: boolean;
}
const ChatMessageSkeleton = ({ isSender = false }: Props) => {
  return (
    <div
      className={cn("flex gap-6", isSender ? "justify-end" : "justify-start")}
    >
      <div
        className={cn(isSender ? "flex-row-reverse" : "flex-row", "flex gap-6")}
      >
        <Skeleton className="size-10 rounded-full" />
        <div
          className={cn(
            "flex flex-col gap-2 pb-2.5",
            isSender ? "items-end" : "items-start"
          )}
        >
          <Skeleton className="w-16 h-4" />
          <Skeleton className="w-64 h-10 rounded-3xl" />
          <Skeleton className="w-44 h-10 rounded-3xl" />
        </div>
      </div>
    </div>
  );
};

export default ChatMessageSkeleton;
