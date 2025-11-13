import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import UserAvatar from "@/features/users/components/user-avatar";
import { cn } from "@/lib/utils";
import { SIZE } from "@/types/enum";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";

interface Props {
  selected?: boolean;
}
const ConversationCard = ({ selected = false }: Props) => {
  const [unread, setUnread] = useState(false);
  return (
    <Item
      className={cn(
        " w-full group p-2 cursor-pointer hover:bg-accent hover:text-accent-foreground",
        selected
          ? "bg-gradient-to-b from-purple-400  to-purple-600 shadow-lg"
          : unread
            ? "bg-primary/10"
            : "bg-transparent"
      )}
    >
      <ItemMedia className="bg-gray-300 rounded-full">
        <UserAvatar
          imageUrl="/images/avatar-placeholder.png"
          size={SIZE.SMALL}
        />
      </ItemMedia>
      <ItemContent className="flex flex-row items-center justify-between">
        <ItemGroup>
          <div className="flex flex-row items-center justify-between gap-4">
            <ItemTitle
              className={cn(
                "font-semibold line-clamp-1 hover:underline hover:underline-offset-2",
                selected ? "text-white" : "text-primary"
              )}
            >
              Chat Room Name
            </ItemTitle>
          </div>

          <ItemDescription
            className={cn(
              selected ? "text-white" : "text-foreground",
              "text-xs"
            )}
          >
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Corrupti
            repudiandae unde et ab ducimus quisquam numquam ex facere quae,
            rerum quasi animi reiciendis sapiente enim nihil eum nostrum tempore
            veniam?
          </ItemDescription>
          <p
            className={cn(
              "text-xs font-light pt-1",
              selected ? "text-white" : "text-muted-foreground"
            )}
          >
            4d ago
          </p>
        </ItemGroup>
      </ItemContent>
      <ItemActions className="hidden group-hover:block">
        <Button
          variant="outline"
          size="icon"
          className={cn(
            "rounded-full size-fit p-2  bg-transparent",
            selected ? "border-white hover:bg-transparent" : "border-primary"
          )}
        >
          <MoreHorizontal
            className={cn(
              "size-4",
              selected
                ? "text-white hover:text-white"
                : "hover:text-primary text-primary"
            )}
          />
        </Button>
      </ItemActions>
    </Item>
  );
};

export default ConversationCard;
