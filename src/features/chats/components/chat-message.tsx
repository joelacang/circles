import UserAvatar from "@/features/users/components/user-avatar";
import { getAvatarSize } from "@/lib/get-values";
import { cn } from "@/lib/utils";
import { SIZE } from "@/types/enum";
import ChatReplyMessage from "./chat-reply-message";
import { Message } from "../types";
import { format } from "date-fns";
import ReactBadge from "./react-badge";
import { useChatBar } from "../hooks/use-chat-bar";
import { useIsMobile } from "@/hooks/use-mobile";
import MessageOptions from "./message-options";
import { useChat } from "../../../providers/chat-provider";
import { useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";

interface Props {
  mode?: "sender" | "receiver";
  messageType?: "first" | "middle" | "last" | "none";
  message: Message;
}
export const ChatMessage = ({
  mode = "sender",
  messageType = "none",
  message,
}: Props) => {
  const { open: openFloat, mode: floatMode } = useChatBar();
  const isSender = mode === "sender";
  const isMobile = useIsMobile();
  const usingFloatingChat = openFloat && floatMode === "room";
  const mini = usingFloatingChat || isMobile;
  const { getParticipant, onClearScrolledMessageId } = useChat();
  const author = message.authorId ? getParticipant(message.authorId) : null;
  const { scrolledMessageId, chatContainerRef } = useChat();
  const messageElRef = useRef<HTMLDivElement | null>(null);
  const [highlighted, setHighlighted] = useState(false);
  const isDeleted = Boolean(message.dateDeleted);

  const { ref: messageRef, inView } = useInView({
    threshold: 0,
    root: chatContainerRef ?? undefined,
  });

  const setMessageRef = (node: HTMLDivElement | null) => {
    messageElRef.current = node;
    messageRef(node);
  };

  useEffect(() => {
    if (inView && message.id === scrolledMessageId) {
      setHighlighted(true);
      const timeout = setTimeout(() => {
        setHighlighted(false);
        onClearScrolledMessageId();
      }, 400);

      return () => clearTimeout(timeout);
    }
  }, [inView, scrolledMessageId, message.id]);

  return (
    <div
      className={cn(
        "w-full flex ",
        isSender ? "justify-end" : "justify-start",
        highlighted && "bg-accent/50"
      )}
      ref={setMessageRef}
    >
      <div
        className={cn(
          "flex w-full gap-4",
          isSender ? "flex-row-reverse" : "flex-row"
        )}
      >
        {/* Avatar */}
        {messageType === "first" || messageType === "none" ? (
          <UserAvatar
            imageUrl={author?.imageUrl}
            className="bg-gray-200"
            size={mini ? SIZE.MINI : SIZE.SMALL}
          />
        ) : (
          <div
            className={cn(
              mini ? getAvatarSize(SIZE.MINI) : getAvatarSize(SIZE.SMALL)
            )}
          />
        )}

        {/* Message content */}
        <div
          className={cn(
            "flex flex-col ",
            messageType === "last" || messageType === "none" ? "pb-8" : "pb-2",
            isSender ? "items-end" : " items-start"
          )}
        >
          {messageType === "first" || messageType === "none" ? (
            <p
              className={cn(
                "text-sm  pb-2 font-semibold text-primary",
                isSender ? "text-right" : "text-left"
              )}
            >
              {author?.name ?? "Unknown User"}
            </p>
          ) : null}

          {/* Parent Message Here */}
          {message.parentMessageId && (
            <div className={cn("  pt-2")}>
              <ChatReplyMessage messageId={message.parentMessageId} />
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
                  " py-3 px-6 max-w-lg  border flex flex-col gap-3 rounded-3xl",
                  isDeleted
                    ? "bg-gray-300 dark:bg-gray-800 italic text-muted-foreground"
                    : isSender
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted",
                  isSender ? " text-right" : "text-left",
                  mini ? "w-full" : "w-fit "
                )}
              >
                <p className="whitespace-pre-wrap text-base">
                  {isDeleted ? "This message has been deleted." : message.body}
                </p>
                <div
                  className={cn(
                    "w-full flex",
                    isSender ? "justify-start" : "justify-end"
                  )}
                >
                  <p
                    className={cn(
                      "text-xs",
                      isDeleted
                        ? "text-muted-foreground"
                        : isSender
                          ? "text-primary-foreground"
                          : "text-muted-foreground",
                      isSender ? "text-right" : "text-left"
                    )}
                  >
                    {isDeleted
                      ? `Deleted ${format(message?.dateDeleted ?? Date.now(), "p")}`
                      : format(message.dateCreated, "p")}
                  </p>
                </div>
              </div>

              {/* Reaction Button and Message Options Here */}

              <MessageOptions isSender={isSender} message={message} />
            </div>

            {/* Reactions HERE */}

            {message.reacts.length > 0 && (
              <div
                className={cn(
                  "flex gap-1 items-center px-4 pb-3",
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
