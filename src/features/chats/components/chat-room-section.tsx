"use client";
import { useIsMobile } from "@/hooks/use-mobile";
import ChatHeader from "./chat-header";
import ChatInput from "./chat-input";
import ChatMessages from "./chat-messages";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail, MailPlus } from "lucide-react";
import Hint from "@/components/hint";
import { useRouter } from "next/navigation";
import { ChatDetail } from "../types";
import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";

interface Props {
  chat: ChatDetail;
}

const ChatRoomSection = ({ chat }: Props) => {
  const isMobile = useIsMobile();
  const router = useRouter();
  const [showNewMsgBtn, setShowNewMsgBtn] = useState(false);
  const [scrollToBottom, setScrollToBottom] = useState(false);
  const [scrolling, setScrolling] = useState(false);
  const readChat = useMutation(api.chats.readChat);

  const handleScrolledToBottom = () => {
    setScrollToBottom(false);
    setShowNewMsgBtn(false);
    setScrolling(false);
  };

  const handleNewMessageClick = async () => {
    await readChat({ chatId: chat.chat.id });
    setScrollToBottom(true);
    setScrolling(true);
  };

  return (
    <div className="w-full  h-full">
      {/* HEADER */}
      <div className="border-b flex flex-row items-center justify-start p-2 gap-2">
        {isMobile && (
          <Hint tooltip="Back to Messages">
            <Button
              size="icon"
              variant="outline"
              className="rounded-full border-primary"
              onClick={() => {
                router.push(`/messages`);
              }}
            >
              <ArrowLeft className="text-primary" />
            </Button>
          </Hint>
        )}
        <ChatHeader chat={chat} />
      </div>

      {/* MESSAGES */}
      <div
        className={cn(
          "h-[calc(100vh-228px)] @5xl:h-[calc(100vh-184px)] overflow-y-auto relative"
        )}
      >
        <ChatMessages
          chat={chat}
          onShowNewMessage={() => setShowNewMsgBtn(true)}
          scrollToBottom={scrollToBottom}
          onScrolledToBottom={handleScrolledToBottom}
        />

        {showNewMsgBtn && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <Button
              className="bg-gradient-to-br rounded-2xl from-rose-400 to-rose-600 shadow-xl"
              size="sm"
              disabled={scrolling}
              onClick={handleNewMessageClick}
            >
              {`${chat.chat.unreadCount} New Message`}
            </Button>
          </div>
        )}
      </div>

      {/* INPUT */}
      <div className="p-2">
        <ChatInput chatId={chat.chat.id} />
      </div>
    </div>
  );
};

export default ChatRoomSection;
