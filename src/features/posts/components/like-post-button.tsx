import { HeartIcon } from "lucide-react";
import PostActionButton from "./post-action-button";
import { Id } from "../../../../convex/_generated/dataModel";
import { api } from "../../../../convex/_generated/api";
import { useConvexMutationHandler } from "@/hooks/use-convex-mutation-handler";
import { useMutation } from "convex/react";
import toast from "react-hot-toast";

interface Props {
  isLiked: boolean;
  count: number;
  postId: Id<"posts">;
}
const LikePostButton = ({ isLiked, count, postId }: Props) => {
  const { mutate: likePost, isLoading: isLikingPost } =
    useConvexMutationHandler(useMutation(api.likes.likePost));
  const { mutate: unlikePost, isLoading: isUnlikingPost } =
    useConvexMutationHandler(useMutation(api.likes.unlikePost));

  const isLoading = isLikingPost || isUnlikingPost;

  const handleLikePost = () => {
    likePost(
      { postId },
      {
        onLoading: () => {
          toast.loading("Liking Post...", { id: "like-post-toast" });
        },
        onSuccess: () => {
          toast.success("Post liked successfully.");
        },
        onError: (error) => {
          toast.error(`Error liking post: ${error}`);
        },
        onSettled: () => {
          toast.dismiss("like-post-toast");
        },
      }
    );
  };

  const handleUnlikePost = () => {
    unlikePost(
      { postId },
      {
        onLoading: () => {
          toast.loading("Removing Like from Post...", {
            id: "unlike-post-toast",
          });
        },
        onSuccess: () => {
          toast.success("Like removed from post.");
        },
        onError: (error) => {
          toast.error(`Error removing like from post: ${error}`);
        },
        onSettled: () => {
          toast.dismiss("unlike-post-toast");
        },
      }
    );
  };

  return (
    <PostActionButton
      tooltip={isLiked ? "Remove Like" : "Like Post"}
      icon={HeartIcon}
      count={count}
      disabled={isLoading}
      action={() => {
        if (isLiked) {
          handleUnlikePost();
        } else {
          handleLikePost();
        }
      }}
      color="#f43f5e"
      filled={isLiked}
    />
  );
};

export default LikePostButton;
