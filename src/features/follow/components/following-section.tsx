import { api } from "../../../../convex/_generated/api";
import { useInfiniteQuery } from "@/hooks/use-infinite-query";
import FollowCard from "./follow-card";
import { Id } from "../../../../convex/_generated/dataModel";
import { UserPreview } from "@/features/users/types";

interface Props {
  userId: Id<"users">;
}

const FollowingSection = ({ userId }: Props) => {
  const { isLoadingFirstPage, results } = useInfiniteQuery<
    { userId: string },
    UserPreview
  >(api.follows.getFollowing, { userId }, 10);

  return (
    <div>
      {results.map((user) => (
        <FollowCard isLoading={isLoadingFirstPage} user={user} key={user.id} />
      ))}
    </div>
  );
};

export default FollowingSection;
