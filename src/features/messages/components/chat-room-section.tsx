"use client";
import { useIsMobile } from "@/hooks/use-mobile";
import ChatHeader from "./chat-header";
import ChatInput from "./chat-input";
import ChatMessages from "./chat-messages";
import { cn } from "@/lib/utils";

const ChatRoomSection = () => {
  const isMobile = useIsMobile();
  return (
    <div className="w-full  h-full">
      {/* HEADER */}
      <div className="border-b">
        <ChatHeader />
      </div>

      {/* MESSAGES */}
      <div
        className={cn(
          " overflow-y-auto p-4",
          isMobile ? "h-[calc(100vh-228px)]" : "h-[calc(100vh-172px)]"
        )}
      >
        <ChatMessages />
      </div>

      {/* INPUT */}
      <div className="p-2">
        <ChatInput />
      </div>
    </div>
  );
};

export default ChatRoomSection;
