import { useInfiniteQuery } from "@/hooks/use-infinite-query";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import CommentCard from "./comment-card";
import { Comment } from "../types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import LoadingMessage from "@/components/loading-message";

interface Props {
  postId: Id<"posts">;
  parentCommentId: Id<"comments">;
  level: number;
}
const RepliesLoader = ({ postId, parentCommentId, level }: Props) => {
  const { results, isLoadingMore, hasMore, isDone, loadMore } =
    useInfiniteQuery<
      { postId: Id<"posts">; parentCommentId: Id<"comments"> },
      Comment
    >(api.comments.getReplies, { postId, parentCommentId }, 3);

  return (
    <div className="py-2">
      {results.map((comment, index) => (
        <div className="relative " key={comment.id}>
          <div
            className={cn(
              "absolute bg-primary left-4 w-px ",
              index === results.length - 1 && !hasMore ? "h-4" : "h-full"
            )}
          />
          <div className="pl-10">
            <CommentCard
              comment={comment}
              childComment
              lastChildComment={index === results.length - 1}
              level={level}
            />
          </div>
        </div>
      ))}
      {hasMore && (
        <div className="relative">
          <div className="bg-primary absolute top-4 left-4 h-px w-6" />
          <div className="bg-primary w-px h-4 absolute left-4" />
          <Button
            variant="link"
            className=" pl-12 cursor-pointer underline font-semibold text-sm"
            onClick={loadMore}
          >
            Load More Replies
          </Button>
        </div>
      )}

      {isLoadingMore && (
        <div className="relative">
          <div className="pl-12">
            <LoadingMessage message="Loading More Replies..." />
          </div>
        </div>
      )}
    </div>
  );
};

export default RepliesLoader;
