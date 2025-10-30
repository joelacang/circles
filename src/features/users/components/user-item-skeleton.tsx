import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface Props {
  variant?: "default" | "outline" | "muted";
  size?: "default" | "sm" | "micro";
}
const UserItemSkeleton = ({ variant, size }: Props) => {
  return (
    <Item
      variant={variant}
      size={size === "micro" ? "sm" : size}
      className={cn("w-full", size === "sm" ? "p-2" : "p-3")}
    >
      <ItemMedia>
        <Skeleton className="rounded-full size-12" />
      </ItemMedia>
      <ItemContent className="flex flex-col items-start justify-center">
        <div className=" flex flex-col gap-1">
          <Skeleton className="w-24 h-5" />

          <Skeleton className="h-4 w-28" />
        </div>
      </ItemContent>
    </Item>
  );
};

export default UserItemSkeleton;
