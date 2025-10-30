import { useInfiniteQuery } from "@/hooks/use-infinite-query";
import { Doc, Id } from "../../../../convex/_generated/dataModel";
import { api } from "../../../../convex/_generated/api";
import { ORDER } from "@/types/enum";
import CommentCard from "./comment-card";
import { Comment } from "../types";
import { Loader2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import LoadingMessage from "@/components/loading-message";
import RepliesLoader from "./replies-loader";

interface Props {
  postId: Id<"posts">;
  order: ORDER;
}

const CommentsLoader = ({ postId, order }: Props) => {
  const {
    results,
    isLoadingFirstPage,
    isLoadingMore,
    loadMore,
    hasMore,
    isDone,
  } = useInfiniteQuery<{ postId: Id<"posts">; order: ORDER }, Comment>(
    api.comments.getTopLevelComments,
    { postId, order },
    5,
    false
  );

  if (isLoadingFirstPage) {
    return <LoadingMessage message="Loading Comments..." />;
  }

  return (
    <div className="space-y-2">
      {results.map((comment) => (
        <div key={comment.id} className="space-y-2">
          <CommentCard comment={comment} level={0} />
        </div>
      ))}
      {hasMore && (
        <Button
          variant="link"
          className="cursor-pointer underline underline-offset-4 size-fit p-0 font-semibold"
          onClick={() => loadMore()}
        >
          <p>Load More Comments</p>
        </Button>
      )}
      {isLoadingMore && <LoadingMessage message="Loading More Comments..." />}
    </div>
  );
};

export default CommentsLoader;
