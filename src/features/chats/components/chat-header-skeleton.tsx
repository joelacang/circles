import {
  Item,
  ItemActions,
  ItemContent,
  ItemGroup,
  ItemMedia,
} from "@/components/ui/item";
import { Skeleton } from "@/components/ui/skeleton";
import { useIsMobile } from "@/hooks/use-mobile";

const ChatHeaderSkeleton = () => {
  const isMobile = useIsMobile();

  return (
    <div className="border-b w-full flex flex-row items-start justify-between p-2 gap-2">
      {isMobile && <Skeleton className="size-10 rounded-full" />}
      <Item className="p-1 w-full">
        <ItemMedia>
          <Skeleton className="size-10 rounded-full" />
        </ItemMedia>
        <ItemContent>
          <ItemGroup className="space-y-1">
            <Skeleton className="w-24 h-5" />
            <Skeleton className="w-16 h-4" />
          </ItemGroup>
        </ItemContent>
        <ItemActions>
          <Skeleton className="size-10 rounded-full" />
        </ItemActions>
      </Item>
    </div>
  );
};

export default ChatHeaderSkeleton;
