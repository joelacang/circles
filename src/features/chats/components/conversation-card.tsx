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
import { cn } from "@/lib/utils";
import { MoreHorizontal } from "lucide-react";
import { ChatDetail } from "../types";
import { useRouter } from "next/navigation";
import { useChatBar } from "../hooks/use-chat-bar";
import { getChatName } from "../utils";
import { formatDistanceToNowStrict } from "date-fns";
import ChatAvatar from "./chat-avatar";
import { useLoggedUser } from "@/features/users/hooks/use-logged-user";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import Hint from "@/components/hint";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useConvexMutationHandler } from "@/hooks/use-convex-mutation-handler";
import toast from "react-hot-toast";
import ToastMessage from "@/components/toast-message";
import { MODE } from "@/types/enum";
import { bgGradientPrimary } from "@/lib/get-values";

interface Props {
  selected?: boolean;
  chat: ChatDetail;
}
const ConversationCard = ({ chat, selected = false }: Props) => {
  const { loggedUser } = useLoggedUser();
  const router = useRouter();
  const { onOpenChat, open, mode } = useChatBar();
  const unread = chat.chat.unreadCount > 0;
  const readChatFn = useMutation(api.chats.readChat);
  const { mutate: readChat } = useConvexMutationHandler(readChatFn);
  const getLatestSender = () => {
    if (loggedUser?.id === chat.chat.latestMessageSenderId) return loggedUser;

    if (chat.type === "direct") return chat.participant;

    if (chat.type === "custom") {
      const sender = chat.participants.find(
        (p) => p.id === chat.chat.latestMessageSenderId
      );

      return sender ?? null;
    }

    return null;
  };

  const handleReadChat = () => {
    readChat(
      { chatId: chat.chat.id },
      {
        onError: (error) => {
          toast.custom(() => (
            <ToastMessage
              message="Error updating chat."
              description={error}
              mode={MODE.ERROR}
            />
          ));
        },
      }
    );
  };

  const latestSender = getLatestSender();

  return (
    <Item
      className={cn(
        " w-full group p-2 cursor-pointer hover:bg-accent hover:text-accent-foreground",
        selected
          ? `shadow-lg ${bgGradientPrimary}`
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
          if (unread) {
            handleReadChat();
          }
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
            <div>
              <div className=" flex-1 flex flex-row items-start justify-start gap-2">
                {latestSender && (
                  <div className="pt-2 flex gap-1">
                    <div className="flex flex-row gap-1 border border-white rounded-full">
                      <Hint tooltip={latestSender.name ?? "Unknown User"}>
                        <Avatar className="size-5">
                          <AvatarImage
                            src={
                              latestSender.imageUrl ??
                              "/images/avatar-placeholder.png"
                            }
                            alt="User Avatar"
                            className="object-cover"
                          />
                        </Avatar>
                      </Hint>
                    </div>
                    :
                  </div>
                )}
                <ItemDescription
                  className={cn(
                    selected ? "text-white" : "text-foreground",
                    "text-sm py-1 line-clamp-2 "
                  )}
                >
                  {chat.chat.latestMessage}
                </ItemDescription>
              </div>
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
