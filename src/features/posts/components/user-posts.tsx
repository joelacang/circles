import { api } from "../../../../convex/_generated/api";
import PostCard from "./post-card";
import { useGetUserDetails } from "@/features/users/hooks/use-get-user-details";
import { useInfiniteQuery } from "@/hooks/use-infinite-query";
import { Post } from "../types";
import PostCardSkeleton from "./post-card-skeleton";

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

  const { user, loading: isLoadingUser } = useGetUserDetails(userId);

  if (isLoadingFirstPage || isLoadingUser) {
    return (
      <div className="space-y-4">
        <PostCardSkeleton />
        <PostCardSkeleton />
        <PostCardSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {results.map((post) => (
        <PostCard
          key={post.id}
          post={{
            ...post,
            author: user,
          }}
        />
      ))}
      {isLoadingMore && (
        <div className="space-y-4">
          <PostCardSkeleton />
          <PostCardSkeleton />
          <PostCardSkeleton />
        </div>
      )}
      {hasMore && <div ref={sentinelRef} />}
      {isDone && (
        <p className="text-center text-xs text-gray-500">No more posts.</p>
      )}
    </div>
  );
};

export default UserPosts;
