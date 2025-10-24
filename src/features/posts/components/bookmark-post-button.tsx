import { BookmarkIcon } from "lucide-react";
import { Id } from "../../../../convex/_generated/dataModel";
import PostActionButton from "./post-action-button";
import { useConvexMutationHandler } from "@/hooks/use-convex-mutation-handler";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import toast from "react-hot-toast";

interface Props {
  isBookmarked: boolean;
  count: number;
  postId: Id<"posts">;
}

const BookmarkPostButton = ({ isBookmarked, count, postId }: Props) => {
  const { mutate: bookmarkPost, isLoading: isBookmarkingPost } =
    useConvexMutationHandler(useMutation(api.bookmarks.bookmarkPost));

  const { mutate: unbookmarkPost, isLoading: isUnbookmarkingPost } =
    useConvexMutationHandler(useMutation(api.bookmarks.unbookmarkPost));

  const isLoading = isBookmarkingPost || isUnbookmarkingPost;

  const handleBookmarkPost = () => {
    bookmarkPost(
      { postId },
      {
        onLoading: () => {
          toast.loading("Bookmarking Post...", { id: "bookmark-post-toast" });
        },
        onSuccess: () => {
          toast.success("Post bookmarked successfully.");
        },
        onError: (error) => {
          toast.error(`Error bookmarking post: ${error}`);
        },
        onSettled: () => {
          toast.dismiss("bookmark-post-toast");
        },
      }
    );
  };

  const handleUnbookmarkPost = () => {
    unbookmarkPost(
      { postId },
      {
        onLoading: () => {
          toast.loading("Removing Bookmark from Post...", {
            id: "unbookmark-post-toast",
          });
        },
        onSuccess: () => {
          toast.success("Bookmark removed from post.");
        },
        onError: (error) => {
          toast.error(`Error removing bookmark from post: ${error}`);
        },
        onSettled: () => {
          toast.dismiss("unbookmark-post-toast");
        },
      }
    );
  };

  return (
    <PostActionButton
      tooltip={isBookmarked ? "Remove Like" : "Like Post"}
      icon={BookmarkIcon}
      count={count}
      disabled={isLoading}
      color="#f97316"
      filled={isBookmarked}
      action={() => {
        if (isBookmarked) {
          handleUnbookmarkPost();
        } else {
          handleBookmarkPost();
        }
      }}
    />
  );
};

export default BookmarkPostButton;
