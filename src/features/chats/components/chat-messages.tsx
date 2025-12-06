import { useInfiniteQuery } from "@/hooks/use-infinite-query";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { ChatDetail, Message } from "../types";
import { useCallback, useEffect, useRef } from "react";
import { groupMessagesByDate } from "../utils";
import SameDayMessages from "./same-day-messages";
import { cn } from "@/lib/utils";
import { useInView } from "react-intersection-observer";
import { useMutation } from "convex/react";
import ChatMessageSkeleton from "./chat-message-skeleton";
import { useChat } from "@/providers/chat-provider";
import ChatMessagesByDate from "./chat-messages-by-date";
import { Grid2X2Plus } from "lucide-react";

interface Props {
  chat: ChatDetail;
  onShowNewMessage: () => void;
  scrollToBottom?: boolean;
  onScrolledToBottom: () => void;
}
const ChatMessages = ({
  chat,
  onShowNewMessage,
  scrollToBottom = false,
  onScrolledToBottom,
}: Props) => {
  const { isLoadingFirstPage, results: messages } = useInfiniteQuery<
    { chatId: Id<"chats"> },
    Message
  >(api.messages.getChatMessages, { chatId: chat.chat.id }, 50);
  const groupedMsgs = groupMessagesByDate(messages);
  const bottomElRef = useRef<HTMLDivElement>(null);
  const readChat = useMutation(api.chats.readChat);
  const { onAddContainerRef } = useChat();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const containerRef = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      scrollContainerRef.current = node;
      onAddContainerRef(node);
    }
  }, []);
  const dateRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const { ref: bottomRef, inView: isAtBottom } = useInView({
    threshold: 0,
    root: scrollContainerRef.current ?? undefined,
  });

  const setBottomRef = (node: HTMLDivElement | null) => {
    bottomElRef.current = node;
    bottomRef(node);
  };

  useEffect(() => {
    if (chat.chat.unreadCount <= 0) return;

    if (isAtBottom) {
      bottomElRef.current?.scrollIntoView({ behavior: "smooth" });
      readChat({ chatId: chat.chat.id });
      onScrolledToBottom();
    } else {
      onShowNewMessage();
    }
  }, [
    chat.chat.unreadCount,
    isAtBottom,
    chat.chat.id,
    readChat,
    onShowNewMessage,
    onScrolledToBottom,
  ]);

  useEffect(() => {
    if (scrollToBottom && bottomElRef.current) {
      // Ensure scroll happens after DOM updates
      requestAnimationFrame(() => {
        bottomElRef.current?.scrollIntoView({ behavior: "smooth" });
        onScrolledToBottom();
      });
    }
  }, [scrollToBottom]);

  useEffect;

  if (isLoadingFirstPage) {
    return (
      <div className=" flex w-full relative flex-col-reverse p-4 h-full overflow-y-auto gap-8">
        <ChatMessageSkeleton isSender />
        <ChatMessageSkeleton />
        <ChatMessageSkeleton isSender />
        <ChatMessageSkeleton />
      </div>
    );
  }

  return (
    <div
      className={cn(
        " flex w-full relative flex-col-reverse p-4 h-full overflow-y-auto"
      )}
      ref={containerRef}
    >
      <div ref={setBottomRef} className="absolute bottom-0 w-1 h-56" />
      {groupedMsgs.map((grp) => (
        <ChatMessagesByDate key={grp.date} group={grp} />
      ))}
    </div>
  );
};

export default ChatMessages;
