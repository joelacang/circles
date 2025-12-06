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
import { ArrowLeft, PanelRightOpen } from "lucide-react";
import { ChatDetail } from "../types";
import ChatAvatar from "./chat-avatar";
import { getChatName } from "../utils";
import { useIsMobile } from "@/hooks/use-mobile";
import Hint from "@/components/hint";
import { usePathname, useRouter } from "next/navigation";
import { useChatBar } from "../hooks/use-chat-bar";

interface Props {
  chat: ChatDetail;
}
const ChatHeader = ({ chat }: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const { open: openFloatBar, mode, onReturn } = useChatBar();
  const usingFloatChat = openFloatBar && mode === "room";
  return (
    <div className="w-full flex flex-row justify-start items-center ">
      {usingFloatChat ? (
        <div className="pl-4">
          <Hint tooltip="Back to Messages">
            <Button
              size="icon"
              variant="outline"
              className="rounded-full border-primary"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                if (usingFloatChat) {
                  onReturn();
                } else {
                  router.push(`/messages`);
                }
              }}
            >
              <ArrowLeft className="text-primary" />
            </Button>
          </Hint>
        </div>
      ) : null}
      <Item className=" w-full">
        <ItemMedia>
          <ChatAvatar chat={chat} />
        </ItemMedia>
        <ItemContent>
          <ItemGroup>
            <ItemTitle className="line-clamp-1">{getChatName(chat)}</ItemTitle>
            <ItemDescription>
              {chat.chat.participantsCount} Participants
            </ItemDescription>
          </ItemGroup>
        </ItemContent>
        {pathname.startsWith(`/messages`) && (
          <ItemActions>
            <Button className="rounded-full" variant="ghost" size="icon">
              <PanelRightOpen className=" size-5 text-primary" />
            </Button>
          </ItemActions>
        )}
      </Item>
    </div>
  );
};

export default ChatHeader;
