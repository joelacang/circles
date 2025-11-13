import { Button } from "@/components/ui/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import UserAvatar from "@/features/users/components/user-avatar";
import { SIZE } from "@/types/enum";
import { MoreVertical } from "lucide-react";

const ChatHeader = () => {
  return (
    <Item className="p-1 w-full">
      <ItemMedia>
        <UserAvatar
          imageUrl="/images/avatar-placeholder.png"
          size={SIZE.SMALL}
          className="bg-gray-200"
        />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>Chat Room Name</ItemTitle>
      </ItemContent>
      <ItemActions>
        <Button className="rounded-full" variant="ghost" size="icon">
          <MoreVertical className="size-5" />
        </Button>
      </ItemActions>
    </Item>
  );
};

export default ChatHeader;
