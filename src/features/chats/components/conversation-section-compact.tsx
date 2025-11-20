import Hint from "@/components/hint";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { ChatDetail } from "../types";
import { Skeleton } from "@/components/ui/skeleton";
import { useParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { getChatName } from "../utils";
import ChatAvatar from "./chat-avatar";
import AddNewMessageButton from "./add-new-message-button";

interface Props {
  isLoading?: boolean;
  chats: ChatDetail[];
}

const ConversationSectionCompact = ({ isLoading, chats }: Props) => {
  const params = useParams();
  const chatIdParams = params.chatId;
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-4">
      <div className="space-y-2  flex flex-col items-center justify-center">
        <AddNewMessageButton />

        <Hint tooltip="Search Conversation">
          <Button className="rounded-full" size="icon" variant="ghost">
            <Search className="text-primary" />
          </Button>
        </Hint>
      </div>

      <div className="pt-6 space-y-3 flex flex-col items-center justify-start h-[calc(100vh-218px)] @5xl:h-[calc(100vh-160px)] overflow-y-auto w-full">
        {isLoading ? (
          <>
            <Skeleton className="size-12 rounded-full" />
            <Skeleton className="size-12 rounded-full" />
            <Skeleton className="size-12 rounded-full" />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center gap-4">
            {chats.map((chat) => {
              const selected = chat.chat.id === chatIdParams;

              return (
                <div key={chat.chat.id} className="relative">
                  {selected && (
                    <>
                      <div className="absolute  -left-3 top-5 rounded-full size-2 bg-primary" />
                    </>
                  )}
                  <Hint tooltip={getChatName(chat)}>
                    <Button
                      className="rounded-full size-12"
                      variant="ghost"
                      onClick={() => router.push(`/messages/${chat.chat.id}`)}
                    >
                      <div
                        className={cn(
                          selected
                            ? "bg-gradient-to-br from-rose-400 via-purple-500 to-purple-700"
                            : "bg-transparent",
                          chat.chat.type === "direct"
                            ? "rounded-full"
                            : "rounded-lg",
                          "shadow-xl p-1"
                        )}
                      >
                        <ChatAvatar chat={chat} showBadge />
                      </div>
                    </Button>
                  </Hint>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationSectionCompact;
