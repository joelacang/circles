import { api } from "../../../../convex/_generated/api";
import PostCard from "./post-card";
import { useInfiniteQuery } from "@/hooks/use-infinite-query";
import { Post } from "../types";
import PostCardSkeleton from "./post-card-skeleton";
import InfoMessage from "@/components/info-message";
import CreatePostButton from "./create-post-button";

interface Props {
  userId: string;
}
const UserPosts = ({ userId }: Props) => {
  const {
    results,
    isLoadingFirstPage,
    isLoadingMore,
    hasMore,
    isDone,
    sentinelRef,
  } = useInfiniteQuery<{ userId: string }, Post>(
    api.posts.getUserPosts,
    { userId },
    5
  );

  if (isLoadingFirstPage) {
    return (
      <div className="space-y-4">
        <PostCardSkeleton />
        <PostCardSkeleton />
        <PostCardSkeleton />
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <InfoMessage
        imageUrl="/images/no-data.png"
        message="No posts found for this user."
        className="max-w-[200px]"
      >
        <CreatePostButton />
      </InfoMessage>
    );
  }

  return (
    <div className="space-y-4">
      {results.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
      {isLoadingMore && (
        <div className="space-y-4">
          <PostCardSkeleton />
        </div>
      )}
      {hasMore && <div ref={sentinelRef} />}
      {isDone && (
        <div className="pt-8">
          <p className="text-center text-xs text-gray-500">
            No more additional posts.
          </p>
        </div>
      )}
    </div>
  );
};

export default UserPosts;
