import UserAvatar from "@/features/users/components/user-avatar";
import { getAvatarSize } from "@/lib/get-values";
import { cn } from "@/lib/utils";
import { SIZE } from "@/types/enum";
import ChatReplyMessage from "./chat-reply-message";
import { Divide } from "lucide-react";

interface Props {
  mode?: "sender" | "receiver";
  messageType?: "first" | "middle" | "last" | "none";
  hasReply?: boolean;
}
export const ChatMessage = ({
  mode = "sender",
  messageType = "none",
  hasReply = false,
}: Props) => {
  const isSender = mode === "sender";

  const getBubbleStyle = () => {
    switch (messageType) {
      case "first":
        return isSender
          ? "rounded-tl-none rounded-r-2xl rounded-bl-none"
          : "rounded-tr-none rounded-l-2xl rounded-br-none";

      case "middle":
        return isSender
          ? "rounded-l-none rounded-r-2xl"
          : " rounded-l-2xl rounded-r-none";

      case "last":
        return isSender
          ? "rounded-tr-2xl rounded-tl-none  rounded-bl-2xl rounded-br-2xl"
          : "rounded-tr-none rounded-tl-2xl  rounded-bl-2xl rounded-br-2xl";

      case "none":
      default:
        return isSender
          ? "rounded-tl-none rounded-tr-2xl rounded-b-2xl"
          : "rounded-tl-2xl rounded-tr-none rounded-b-2xl";
    }
  };

  return (
    <div
      className={cn("w-full flex", isSender ? "justify-start" : "justify-end")}
    >
      <div
        className={cn(
          "flex gap-4 w-fit",
          isSender ? "flex-row" : "flex-row-reverse"
        )}
      >
        {/* Avatar */}
        {messageType === "first" || messageType === "none" ? (
          <UserAvatar
            imageUrl="/images/avatar-placeholder.png"
            className="bg-gray-200"
            size={SIZE.SMALL}
          />
        ) : (
          <div className={getAvatarSize(SIZE.SMALL)} />
        )}

        {/* Message content */}
        <div
          className={cn(
            "flex flex-col",
            messageType === "last" || messageType === "none" ? "pb-6" : "pb-1"
          )}
        >
          {messageType === "first" || messageType === "none" ? (
            <p
              className={cn(
                "text-xs text-muted-foreground px-2 pb-1",
                isSender ? "text-left" : "text-right"
              )}
            >
              John Doe
            </p>
          ) : null}
          {hasReply && (
            <div className="max-w-xs">
              <ChatReplyMessage />
            </div>
          )}
          <div
            className={cn(
              "p-3 max-w-xs text-sm  border",
              isSender
                ? "bg-muted text-left"
                : "bg-primary text-primary-foreground text-right",
              getBubbleStyle()
            )}
          >
            This is a new message.
          </div>
          {messageType === "last" || messageType === "none" ? (
            <p
              className={cn(
                isSender ? "text-left" : "text-right",
                "text-xs text-muted-foreground px-2 pt-2"
              )}
            >
              {new Date().toUTCString()}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
