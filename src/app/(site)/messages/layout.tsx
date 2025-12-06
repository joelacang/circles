"use client";

import ConversationSectionCompact from "@/features/chats/components/conversation-section-compact";
import ConversationsLoader from "@/features/chats/components/conversations-loader";
import ConversationsSection from "@/features/chats/components/conversations-section";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import ChatProvider from "@/providers/chat-provider";
import { useParams } from "next/navigation";

const MessagesLayout = ({ children }: { children: React.ReactNode }) => {
  const params = useParams();
  const chatIdParams = params.chatId;
  const isMobile = useIsMobile();

  return (
    <div className="w-full border rounded-xl flex flex-row h-full">
      {/* CONVERSATIONS LISTS SECTION */}
      <ConversationsLoader />

      {/* CHAT MESSAGES SECTION */}
      <div
        className={cn(
          " flex-1 w-full ",
          chatIdParams && isMobile ? "flex" : "hidden @xl:flex"
        )}
      >
        {children}
      </div>
    </div>
  );
};

export default MessagesLayout;
