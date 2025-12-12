import { Reply, SearchX } from "lucide-react";
import { Id } from "../../../../convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import ErrorMessage from "@/components/error-message";
import { Skeleton } from "@/components/ui/skeleton";
import { useChat } from "../../../providers/chat-provider";

interface Props {
  messageId: Id<"messages">;
}
const ChatReplyMessage = ({ messageId }: Props) => {
  const message = useQuery(api.messages.getMessageByID, { messageId });
  const isLoading = message === undefined;
  const { getParticipant, onScrollToMessageId } = useChat();
  const author = message?.authorId ? getParticipant(message.authorId) : null;

  return (
    <div className="bg-primary/20 rounded-t-xl rounded-b-none cursor-pointer">
      {isLoading ? (
        <div>
          <Skeleton />
          <div>
            <Skeleton />
            <Skeleton />
          </div>
        </div>
      ) : (
        <>
          {message === null ? (
            <div>
              <ErrorMessage icon={SearchX} message="Message Not Found" />
            </div>
          ) : (
            <div
              onClick={() => {
                onScrollToMessageId(messageId);
                console.log(messageId);
              }}
            >
              <div className="p-2 flex flex-row gap-2 items-center justify-start cursor-pointer">
                <Reply className="size-4 text-primary" />
                <p className="text-xs font-semibold text-primary">
                  {`Replying from ${author?.name ?? "Unknown User"}`}
                </p>
              </div>
              <div className="pt-2 pb-6 px-4">
                <p className="text-sm line-clamp-2 italic text-muted-foreground whitespace-pre-wrap">
                  {message.dateDeleted
                    ? "This message has been deleted."
                    : message?.body}
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ChatReplyMessage;
