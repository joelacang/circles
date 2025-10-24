import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import PostCard from "./post-card";
import { useGetUserDetails } from "@/features/users/hooks/use-get-user-details";

interface Props {
  userId: string;
}
const UserPosts = ({ userId }: Props) => {
  const results = useQuery(api.posts.getUserPosts, {
    userId,
    paginationOpts: { cursor: null, numItems: 15 },
  });
  const { user, loading } = useGetUserDetails(userId);

  if (results === undefined || loading) {
    return (
      <div>
        <p>Loading Posts...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {results.page.map((post) => (
        <PostCard
          key={post.id}
          post={{
            ...post,
            author: user,
          }}
        />
      ))}
    </div>
  );
};

export default UserPosts;
