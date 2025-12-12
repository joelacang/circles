import { useInfiniteQuery } from "@/hooks/use-infinite-query";
import { Id } from "../../../../convex/_generated/dataModel";
import { EmojiGroupCount, MessageReact } from "../types";
import { api } from "../../../../convex/_generated/api";
import UserItemSkeleton from "@/features/users/components/user-item-skeleton";
import UserItem from "@/features/users/components/user-item";
import { X } from "lucide-react";
import CloseButton from "@/components/close-button";
import { useLoggedUser } from "@/features/users/hooks/use-logged-user";
import { useMutation } from "convex/react";
import { useConvexMutationHandler } from "@/hooks/use-convex-mutation-handler";
import toast from "react-hot-toast";
import ToastMessage from "@/components/toast-message";
import { MODE } from "@/types/enum";

interface Props {
  emoji: EmojiGroupCount;
  messageId: Id<"messages">;
}
const MessageReactDetails = ({ emoji, messageId }: Props) => {
  const { loggedUser } = useLoggedUser();
  const removeReactionFn = useMutation(api.messageReactions.removeReaction);
  const { mutate: removeReaction, isLoading } =
    useConvexMutationHandler(removeReactionFn);

  const { isLoadingFirstPage, results } = useInfiniteQuery<
    { messageId: Id<"messages">; emojiCode: string },
    MessageReact
  >(
    api.messageReactions.getAllEmojiReactions,
    {
      messageId,
      emojiCode: emoji.emojiCode,
    },
    8
  );

  const handleRemoveReaction = (reactionId: Id<"messageReactions">) => {
    removeReaction(
      { reactionId },
      {
        onError: (error) => {
          toast.custom(() => (
            <ToastMessage
              mode={MODE.ERROR}
              message="Error removing reaction:"
              description={error}
              icon={X}
            />
          ));
        },
      }
    );
  };
  if (isLoadingFirstPage) {
    return (
      <div>
        <UserItemSkeleton />
        <UserItemSkeleton />
        <UserItemSkeleton />
      </div>
    );
  }

  if (!results || results.length === 0) {
    return <div>Sorry, No Results Found</div>;
  }

  return (
    <div className="p-0 ">
      {results.map((data) => (
        <div
          className="flex flex-row items-center cursor-pointer hover:bg-accent justify-between"
          key={data.id}
        >
          <UserItem
            user={data.reactor}
            size="sm"
            subtitle={`@${data.reactor.username}`}
          />
          {data.reactor.id === loggedUser?.id && (
            <div className="px-4">
              <CloseButton
                tooltip="Remove Reaction"
                size="lg"
                onClick={() => handleRemoveReaction(data.id)}
                disabled={isLoading}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MessageReactDetails;
