import { useInfiniteQuery } from "@/hooks/use-infinite-query";
import { ChatDetail } from "../types";
import { api } from "../../../../convex/_generated/api";
import InfoMessage from "@/components/info-message";
import ConversationList from "./conversation-list";
import ConversationCardSkeleton from "./conversation-card-skeleton";
import { MailPlus, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import ErrorMessage from "@/components/error-message";

const ChatFloatingListLoader = () => {
  const { results, isLoadingFirstPage } = useInfiniteQuery<object, ChatDetail>(
    api.chatParticipants.getAllChatParticipation,
    {},
    15
  );

  if (isLoadingFirstPage) {
    return (
      <div className="w-full space-y-1">
        <ConversationCardSkeleton />
        <ConversationCardSkeleton />
        <ConversationCardSkeleton />
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <ErrorMessage icon={SearchX} message="No Chats Found.">
        <Button
          variant="outline"
          className="border-primary border text-primary hover:text-primary hover:bg-accent"
        >
          <MailPlus />
          Message
        </Button>
      </ErrorMessage>
    );
  }

  return (
    <div>
      <ConversationList chats={results} />
    </div>
  );
};

export default ChatFloatingListLoader;
