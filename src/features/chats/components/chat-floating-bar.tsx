import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  ChevronDownCircle,
  ChevronUpCircle,
  MailPlus,
  MessageCircle,
} from "lucide-react";

import ChatHeader from "./chat-header";
import ChatMessages from "./chat-messages";
import ChatInput from "./chat-input";
import { useChatBar } from "../hooks/use-chat-bar";
import ConversationList from "./conversation-list";
import { Button } from "@/components/ui/button";
import ConversationsLoader from "./conversations-loader";
import ChatFloatingListLoader from "./chat-floating-list-loader";
import { useUser } from "@clerk/nextjs";
import Hint from "@/components/hint";
import AddNewMessageButton from "./add-new-message-button";

const ChatFloatingBar = () => {
  const { open, onToggleOpen, mode, room, onReturn } = useChatBar();
  const { user } = useUser();

  return (
    <div
      className={cn(
        "fixed bottom-0 right-4 w-sm border bg-card rounded-t-2xl shadow-xl  transition-all duration-300 overflow-hidden"
      )}
    >
      {/* Header */}
      <div
        className={cn(
          "cursor-pointer flex items-center justify-between h-16 p-2",
          open && "border-b"
        )}
        onClick={() => onToggleOpen()}
      >
        {room ? (
          <div className="flex flex-row items-center justify-start gap-2 w-full ">
            {open ? (
              <Button
                size="icon"
                className="rounded-full text-primary border-primary"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  onReturn();
                }}
              >
                <ArrowLeft />
              </Button>
            ) : null}

            <ChatHeader
              title={room.participant.name ?? "No Name"}
              subtitle={`@${room.participant.username}`}
              avatarUrl={room.participant.imageUrl}
            />
          </div>
        ) : (
          <div className="flex flex-row items-center justify-start gap-2 px-2 text-primary">
            <MessageCircle className="size-5" />
            <p className="font-semibold text-lg">Messages</p>
          </div>
        )}
        <div className=" flex flex-row items-center justify-end gap-2">
          {mode === "list" && open && <AddNewMessageButton />}
          {open ? (
            <ChevronDownCircle className="size-6 text-primary" />
          ) : (
            <ChevronUpCircle className="size-6 text-primary" />
          )}
        </div>
      </div>

      {/* Content */}
      <div
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out flex flex-col gap-2",
          open ? "h-[60vh] opacity-100 " : "h-0 p-0 opacity-0"
        )}
      >
        {mode === "room" ? (
          <>
            <div className="overflow-y-auto px-3 pt-4 h-[calc(60vh-78px)]">
              <ChatMessages />
            </div>
            <div className="h-fit pt-1 px-2 pb-2">
              <ChatInput />
            </div>
          </>
        ) : (
          <div className="overflow-y-auto">
            {user && (
              <div className="p-2">
                <ChatFloatingListLoader />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatFloatingBar;
