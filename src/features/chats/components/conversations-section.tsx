"use client";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { MailPlus, MessageCirclePlus, SearchIcon } from "lucide-react";
import ConversationList from "./conversation-list";
import { cn } from "@/lib/utils";
import { ChatDetail } from "../types";
import ConversationCardSkeleton from "./conversation-card-skeleton";
import InfoMessage from "@/components/info-message";
import Hint from "@/components/hint";
import AddNewMessageButton from "./add-new-message-button";

interface Props {
  isLoading?: boolean;
  chats: ChatDetail[];
}
const ConversationsSection = ({ isLoading = false, chats }: Props) => {
  return (
    <div className="flex h-full flex-col justify-start items-start gap-5 w-full">
      {/* HEADER */}
      <div className="w-full space-y-2 px-4 py-2">
        <div className="flex flex-row items-center justify-between gap-4">
          <p className="text-lg font-semibold text-primary">Messages</p>
          <AddNewMessageButton />
        </div>

        <InputGroup>
          <InputGroupInput placeholder="Search Conversations..." />
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
        </InputGroup>
      </div>

      {/* CONVERSATION LIST */}
      <div
        className={cn(
          " w-full overflow-y-auto px-2 h-[calc(100vh-218px)] @5xl:h-[calc(100vh-160px)]"
        )}
      >
        {isLoading ? (
          <>
            <ConversationCardSkeleton />
            <ConversationCardSkeleton />
            <ConversationCardSkeleton />
          </>
        ) : (
          <>
            {chats.length === 0 ? (
              <div className="block @xl:hidden @7xl:block px-8">
                <InfoMessage
                  imageUrl="/images/not-found.png"
                  message="No Chats Found."
                />
              </div>
            ) : (
              <ConversationList chats={chats} />
            )}
          </>
        )}
      </div>

      {/* FOOTER */}
    </div>
  );
};

export default ConversationsSection;
