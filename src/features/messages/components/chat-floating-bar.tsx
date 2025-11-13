import { cn } from "@/lib/utils";
import { ChevronDown, ChevronDownCircle, ChevronUpCircle } from "lucide-react";
import { useState } from "react";
import ChatHeader from "./chat-header";
import ChatMessages from "./chat-messages";
import ChatInput from "./chat-input";
import { useChatBar } from "../hooks/use-chat-bar";

const ChatFloatingBar = () => {
  const { open, onToggleOpen } = useChatBar();

  return (
    <div
      className={cn(
        "fixed bottom-0 right-4 w-md border bg-card  rounded-t-2xl shadow-xl  transition-all duration-300 overflow-hidden"
      )}
    >
      {/* Header */}
      <div
        className=" p-2 border-b cursor-pointer flex items-center justify-between"
        onClick={() => onToggleOpen()}
      >
        <ChatHeader />
        {open ? (
          <ChevronDownCircle className="size-8 text-primary" />
        ) : (
          <ChevronUpCircle className="size-8 text-primary" />
        )}
      </div>

      {/* Content */}
      <div
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out flex flex-col gap-2",
          open ? "h-[60vh] p-2 opacity-100 " : "h-0 p-0 opacity-0"
        )}
      >
        <div className="overflow-y-auto px-3 pt-4 h-[calc(60vh-96px)]">
          <ChatMessages />
        </div>
        <div className="h-fit">
          <ChatInput />
        </div>
      </div>
    </div>
  );
};

export default ChatFloatingBar;
