"use client";

import ConversationsLoader from "@/features/chats/components/conversations-loader";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
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
