import UserAvatar from "@/features/users/components/user-avatar";
import { getAvatarSize } from "@/lib/get-values";
import { cn } from "@/lib/utils";
import { SIZE } from "@/types/enum";
import ChatReplyMessage from "./chat-reply-message";
import { UserPreview } from "@/features/users/types";
import { Message } from "../types";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Heart,
  MoreHorizontal,
  Smile,
  SmilePlus,
  ThumbsUp,
} from "lucide-react";
import Hint from "@/components/hint";
import { is } from "zod/v4/locales";
import ReactionButton from "@/features/chats/components/reaction-button";
import ReactBadge from "./react-badge";
import MessageDropdownMenu from "./messge-dropdown-menu";

interface Props {
  mode?: "sender" | "receiver";
  messageType?: "first" | "middle" | "last" | "none";
  hasReply?: boolean;
  author: UserPreview | null;
  message: Message;
}
export const ChatMessage = ({
  mode = "sender",
  messageType = "none",
  hasReply = false,
  author,
  message,
}: Props) => {
  const isSender = mode === "sender";

  return (
    <div
      className={cn("w-full flex ", isSender ? "justify-end" : "justify-start")}
    >
      <div
        className={cn(
          "flex gap-4 w-full ",
          isSender ? "flex-row-reverse" : "flex-row"
        )}
      >
        {/* Avatar */}
        {messageType === "first" || messageType === "none" ? (
          <UserAvatar
            imageUrl={author?.imageUrl}
            className="bg-gray-200"
            size={SIZE.SMALL}
          />
        ) : (
          <div className={getAvatarSize(SIZE.SMALL)} />
        )}

        {/* Message content */}
        <div
          className={cn(
            "flex flex-col gap-2",
            messageType === "last" || messageType === "none" ? "pb-8" : "pb-2.5"
          )}
        >
          {messageType === "first" || messageType === "none" ? (
            <p
              className={cn(
                "text-xs text-muted-foreground px-2",
                isSender ? "text-right" : "text-left"
              )}
            >
              {author?.name ?? "Unknown User"}
            </p>
          ) : null}

          {/* Parent Message Here */}
          {hasReply && (
            <div className="max-w-xs">
              <ChatReplyMessage />
            </div>
          )}

          <div
            className={cn(
              "relative flex flex-col gap-2",
              isSender ? "items-end" : "items-start"
            )}
          >
            <div
              className={cn(
                "cursor-pointer flex items-center gap-2",
                isSender ? "flex-row-reverse" : "flex-row"
              )}
            >
              {/* Chat Bubble Here */}
              <div
                className={cn(
                  "py-3 px-6 max-w-lg w-fit text-sm  border flex flex-col gap-4",
                  isSender
                    ? "bg-primary text-primary-foreground text-right"
                    : "bg-muted text-left",
                  "rounded-3xl"
                )}
              >
                <p className="whitespace-pre-wrap">{message.body}</p>
              </div>

              {/* Reaction Button and Message Options Here */}
              <div
                className={cn(
                  "items-center flex ",
                  isSender ? "flex-row-reverse" : "flex-row"
                )}
              >
                <Hint tooltip="React To Message">
                  <div>
                    <ReactionButton messageId={message.id} />
                  </div>
                </Hint>

                <Hint tooltip="Message Options">
                  <div>
                    <MessageDropdownMenu message={message} />
                  </div>
                </Hint>
              </div>
            </div>

            {/* Reactions HERE */}
            {message.reacts.length > 0 && (
              <div
                className={cn(
                  "flex gap-1 items-center px-4",
                  isSender ? "flex-row-reverse" : "flex-row"
                )}
              >
                {message.reacts.map((emoji) => (
                  <ReactBadge
                    emoji={emoji}
                    key={emoji.emojiCode}
                    messageId={message.id}
                  />
                ))}
              </div>
            )}

            {/* Timestamp HERE */}
            <div className="px-4 pb-1">
              <p
                className={cn(
                  "text-xs text-primary",
                  isSender ? "text-right" : "text-left"
                )}
              >
                {format(message.dateCreated, "p")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
