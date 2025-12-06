import React, { createContext, useContext, useState } from "react";
import { ChatDetail, Message } from "../features/chats/types";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import ChatHeaderSkeleton from "../features/chats/components/chat-header-skeleton";
import ErrorMessage from "@/components/error-message";
import { SearchX } from "lucide-react";
import { UserPreview } from "@/features/users/types";
import { useLoggedUser } from "@/features/users/hooks/use-logged-user";
import { useScrollToById } from "@/hooks/use-scroll-to-by-id";

type ChatContext = {
  chat: ChatDetail;
  messageToReply: Message | null;
  onReplyToMessage: (message: Message) => void;
  onRemoveReply: () => void;
  getParticipant: (userId: Id<"users">) => UserPreview | null;
  onScrollToMessageId: (messageId: Id<"messages">) => void;
  onClearScrolledMessageId: () => void;
  scrolledMessageId: Id<"messages"> | null;
  chatContainerRef: HTMLDivElement | null;
  onAddContainerRef: (container: HTMLDivElement) => void;
};

const ChatContext = createContext<ChatContext | null>(null);

export const useChat = () => {
  const ctx = useContext(ChatContext);

  if (!ctx) throw new Error("useChat must be used with ChatProvider.");

  return ctx;
};

interface Props {
  chatId: Id<"chats">;
  children: React.ReactNode;
}

const ChatProvider = ({ children, chatId }: Props) => {
  const [replyMessage, setReplyMessage] = useState<Message | null>(null);
  const [scrolledMessageId, setScrolledMessageId] =
    useState<Id<"messages"> | null>(null);
  const chat = useQuery(api.chats.getChat, { chatId: chatId });
  const { loggedUser } = useLoggedUser();
  const scrollToMessage = useScrollToById();
  const [chatContainerRef, setChatContainerRef] =
    useState<HTMLDivElement | null>(null);

  const onAddContainerRef = (ref: HTMLDivElement) => {
    setChatContainerRef(ref);
  };

  const onReplyToMessage = (message: Message) => {
    setReplyMessage(message);
  };

  const onRemoveReply = () => {
    setReplyMessage(null);
  };

  const onScrollToMessageId = (messageId: Id<"messages">) => {
    setScrolledMessageId(messageId);
    scrollToMessage(messageId);
  };

  const onClearScrolledMessageId = () => {
    setScrolledMessageId(null);
  };

  const getParticipant = (userId: Id<"users">) => {
    if (userId === loggedUser?.id) return loggedUser;

    if (chat?.type === "direct") {
      return chat.participant;
    }

    if (chat?.type === "custom") {
      const participant = chat.participants.find((p) => p.id === userId);

      return participant ?? null;
    }

    return null;
  };

  if (chat === undefined) {
    return <ChatHeaderSkeleton />;
  }

  if (chat === null) {
    return <ErrorMessage icon={SearchX} message="Chat Not Found" />;
  }

  return (
    <ChatContext.Provider
      value={{
        chat,
        messageToReply: replyMessage,
        scrolledMessageId,
        chatContainerRef,
        onReplyToMessage,
        onRemoveReply,
        getParticipant,
        onScrollToMessageId,
        onClearScrolledMessageId,
        onAddContainerRef,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export default ChatProvider;
