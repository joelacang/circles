import { useInfiniteQuery } from "@/hooks/use-infinite-query";
import { ChatDetail } from "../types";
import { api } from "../../../../convex/_generated/api";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import ConversationSectionCompact from "./conversation-section-compact";
import ConversationsSection from "./conversations-section";
import InfoMessage from "@/components/info-message";

const ConversationsLoader = () => {
  const params = useParams();
  const chatIdParams = params.chatId;
  const router = useRouter();
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const { results, isLoadingFirstPage, isLoadingMore, hasMore, isDone } =
    useInfiniteQuery<object, ChatDetail>(
      api.chatParticipants.getAllChatParticipation,
      {},
      15
    );

  useEffect(() => {
    const shouldRedirect =
      pathname.startsWith("/messages") &&
      !isMobile &&
      !isLoadingFirstPage &&
      !chatIdParams &&
      results.length > 0;

    if (shouldRedirect) {
      router.push(`/messages/${results[0].chat.id}`);
    }
  }, [pathname, isLoadingFirstPage, chatIdParams, results, router, isMobile]);

  return (
    <div
      className={cn(
        " w-full @xl:w-28 @7xl:w-sm @xl:border-r",
        chatIdParams && isMobile ? "hidden" : "block"
      )}
    >
      <div className=" hidden @xl:block @7xl:hidden">
        <ConversationSectionCompact
          isLoading={isLoadingFirstPage}
          chats={results}
        />
      </div>
      <div className="block @xl:hidden @7xl:block">
        <ConversationsSection isLoading={isLoadingFirstPage} chats={results} />
      </div>
    </div>
  );
};

export default ConversationsLoader;
