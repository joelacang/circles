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
import { ChatDetail } from "../types";
import { useIsMobile } from "@/hooks/use-mobile";
import { useRouter } from "next/navigation";
import { useChatBar } from "../hooks/use-chat-bar";
import { getChatName } from "../utils";
import { formatDistanceToNowStrict } from "date-fns";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import Image from "next/image";
import ChatAvatar from "./chat-avatar";
import { Dirent } from "fs";

interface Props {
  selected?: boolean;
  chat: ChatDetail;
}
const ConversationCard = ({ chat, selected = false }: Props) => {
  const [unread, setUnread] = useState(false);
  const isMobile = useIsMobile();
  const router = useRouter();
  const { onOpenChat, open, mode } = useChatBar();
  const latestSender =
    chat.type !== "direct"
      ? chat.participants.find((p) => p.id === chat.chat.latestMessageSenderId)
      : undefined;

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
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (open && mode === "list") {
          onOpenChat(chat);
        } else {
          router.push(`/messages/${chat.chat.id}`);
        }
      }}
    >
      <ItemMedia className="relative">
        <ChatAvatar chat={chat} showBadge />
      </ItemMedia>
      <ItemContent className="flex flex-row items-center justify-between">
        <ItemGroup className="w-full">
          <div className="flex relative flex-row items-center justify-between gap-4">
            <ItemTitle
              className={cn(
                "font-semibold line-clamp-1 hover:underline hover:underline-offset-2",
                selected ? "text-white" : "text-primary"
              )}
            >
              {getChatName(chat)}
            </ItemTitle>
          </div>
          <div className="flex flex-row w-full items-start justify-between">
            <div className=" flex-1">
              <ItemDescription
                className={cn(
                  selected ? "text-white" : "text-foreground",
                  "text-xs py-1 line-clamp-2 "
                )}
              >
                {latestSender && (
                  <span className="font-semibold ">{`${latestSender.name}: `}</span>
                )}
                <span>{chat.chat.latestMessage}</span>
              </ItemDescription>
              <p
                className={cn(
                  "text-xs font-light pt-1",
                  selected ? "text-white" : "text-muted-foreground"
                )}
              >
                {`${formatDistanceToNowStrict(
                  chat.chat.latestMessageTime ?? chat.chat.dateCreated
                )} ago`}
              </p>
            </div>
            <ItemActions className="hidden group-hover:block pt-2">
              <Button
                variant="outline"
                size="icon"
                className={cn(
                  "rounded-full size-fit p-1  bg-transparent",
                  selected
                    ? "border-white hover:bg-transparent"
                    : "border-primary"
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
          </div>
        </ItemGroup>
      </ItemContent>
    </Item>
  );
};

export default ConversationCard;
