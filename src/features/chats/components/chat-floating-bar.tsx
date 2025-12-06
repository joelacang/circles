import { cn } from "@/lib/utils";
import {
  ChevronDownCircle,
  ChevronUpCircle,
  MessageCircle,
} from "lucide-react";
import ChatHeader from "./chat-header";
import { useChatBar } from "../hooks/use-chat-bar";
import ChatFloatingListLoader from "./chat-floating-list-loader";
import { useUser } from "@clerk/nextjs";
import AddNewMessageButton from "./add-new-message-button";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import ChatProvider from "../../../providers/chat-provider";
import ChatFloatingRoom from "./chat-floating-room";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useCounts } from "@/providers/counts-provider";
import UnreadBadge from "@/components/unread-badge";
import { bgGradientPrimary } from "@/lib/get-values";

const ChatFloatingBar = () => {
  const { open, onToggleOpen, mode, room, onReturn, onClose } = useChatBar();
  const { user } = useUser();
  const pathname = usePathname();
  const { unreadMsgs } = useCounts();
  useEffect(() => {
    if (!pathname.startsWith(`/messages`)) {
      onClose();
    }
  }, [pathname, onClose]);
  const isMsgsUnread = unreadMsgs > 0 && !open;

  return (
    <div
      className={cn(
        "fixed bottom-0 right-4 w-md border  rounded-t-2xl shadow-xl bg-card  transition-all duration-300 overflow-hidden"
      )}
    >
      {/* Header */}
      <div
        className={cn(
          "cursor-pointer flex items-center justify-between",
          open && "border-b",
          mode === "list" && isMsgsUnread ? bgGradientPrimary : "bg-card"
        )}
        onClick={() => onToggleOpen()}
      >
        {room ? (
          <ChatHeader chat={room} />
        ) : (
          <div
            className={cn(
              "flex flex-row items-center justify-start gap-2 p-4",
              isMsgsUnread ? "text-primary-foreground" : "text-primary"
            )}
          >
            <MessageCircle className="size-5" />
            <p className="font-semibold text-lg">Messages</p>
            <div className="pl-4">
              {isMsgsUnread && (
                <UnreadBadge count={unreadMsgs} mode="secondary" />
              )}
            </div>
          </div>
        )}
        <div className=" flex flex-row items-center justify-end gap-2 p-4">
          {mode === "list" && open && <AddNewMessageButton />}
          {open ? (
            <ChevronDownCircle
              className={cn(
                "size-6 ",
                isMsgsUnread ? "text-primary-foreground" : "text-primary"
              )}
            />
          ) : (
            <ChevronUpCircle
              className={cn(
                "size-6",
                isMsgsUnread ? "text-primary-foreground" : "text-primary"
              )}
            />
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
        {mode === "room" && room ? (
          <ChatProvider chatId={room.chat.id}>
            <ChatFloatingRoom />
          </ChatProvider>
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
