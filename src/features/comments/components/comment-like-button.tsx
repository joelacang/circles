import PostActionButton from "@/features/posts/components/post-action-button";
import { Id } from "../../../../convex/_generated/dataModel";
import { HeartIcon } from "lucide-react";
import { useConvexMutationHandler } from "@/hooks/use-convex-mutation-handler";
import { api } from "../../../../convex/_generated/api";
import { useMutation } from "convex/react";
import toast from "react-hot-toast";

interface Props {
  isLiked: boolean;
  commentId: Id<"comments">;
  count: number;
}
const CommentLikeButton = ({ isLiked, commentId, count }: Props) => {
  const { mutate: likeComment, isLoading: isLikingComment } =
    useConvexMutationHandler(useMutation(api.commentLikes.likeComment));
  const { mutate: unlikeComment, isLoading: isUnlikingComment } =
    useConvexMutationHandler(useMutation(api.commentLikes.unlikeComment));

  const isLoading = isLikingComment || isUnlikingComment;

  const handleLikeComment = () => {
    likeComment(
      { commentId },
      {
        onLoading: () => {
          toast.loading("Liking Comment...", { id: "like-comment-toast" });
        },
        onSuccess: () => {
          toast.success("Comment liked successfully.");
        },
        onError: (error) => {
          toast.error(`Error liking comment: ${error}`);
        },
        onSettled: () => {
          toast.dismiss("like-comment-toast");
        },
      }
    );
  };

  const handleUnlikeComment = () => {
    unlikeComment(
      { commentId },
      {
        onLoading: () => {
          toast.loading("Removing Like from Comment...", {
            id: "unlike-comment-toast",
          });
        },
        onSuccess: () => {
          toast.success("Comment removed from comment.");
        },
        onError: (error) => {
          toast.error(`Error removing like from comment: ${error}`);
        },
        onSettled: () => {
          toast.dismiss("unlike-comment-toast");
        },
      }
    );
  };

  return (
    <PostActionButton
      tooltip="Like Post"
      icon={HeartIcon}
      count={count}
      action={() => {
        if (isLiked) {
          handleUnlikeComment();
        } else {
          handleLikeComment();
        }
      }}
      color="#f43f5e"
      filled={isLiked}
    />
  );
};

export default CommentLikeButton;
