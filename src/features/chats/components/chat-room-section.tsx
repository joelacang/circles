"use client";
import { useIsMobile } from "@/hooks/use-mobile";
import ChatHeader from "./chat-header";
import ChatInput from "./chat-input";
import ChatMessages from "./chat-messages";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Hint from "@/components/hint";
import { useRouter } from "next/navigation";
import { ChatDetail } from "../types";

interface Props {
  chat: ChatDetail;
}
const ChatRoomSection = ({ chat }: Props) => {
  const isMobile = useIsMobile();
  const router = useRouter();

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
          " overflow-y-auto p-4",
          "h-[calc(100vh-228px)] @5xl:h-[calc(100vh-184px)]"
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
