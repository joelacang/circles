import { api } from "../../../../convex/_generated/api";
import { useInfiniteQuery } from "@/hooks/use-infinite-query";
import FollowCard from "./follow-card";
import { UserPreview } from "@/features/users/types";

interface Props {
  userId: string;
}

const FollowersSection = ({ userId }: Props) => {
  const { isLoadingFirstPage, results } = useInfiniteQuery<
    { userId: string },
    UserPreview
  >(api.follows.getFollowers, { userId }, 10);

  return (
    <div>
      {results.map((user) => (
        <FollowCard isLoading={isLoadingFirstPage} user={user} key={user.id} />
      ))}
    </div>
  );
};

export default FollowersSection;
