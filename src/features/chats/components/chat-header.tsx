import { Button } from "@/components/ui/button";
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
import { SIZE } from "@/types/enum";
import { MoreVertical } from "lucide-react";
import { ChatDetail } from "../types";
import ChatAvatar from "./chat-avatar";
import { getChatName } from "../utils";

interface Props {
  chat: ChatDetail;
}
const ChatHeader = ({ chat }: Props) => {
  return (
    <Item className="p-1 w-full">
      <ItemMedia>
        <ChatAvatar chat={chat} />
      </ItemMedia>
      <ItemContent>
        <ItemGroup>
          <ItemTitle>{getChatName(chat)}</ItemTitle>
          <ItemDescription>
            {chat.chat.participantsCount} Participants
          </ItemDescription>
        </ItemGroup>
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
