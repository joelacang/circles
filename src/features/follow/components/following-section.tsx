import { api } from "../../../../convex/_generated/api";
import { useInfiniteQuery } from "@/hooks/use-infinite-query";
import FollowCard from "./follow-card";
import { Id } from "../../../../convex/_generated/dataModel";

interface Props {
  userId: Id<"users">;
}

const FollowingSection = ({ userId }: Props) => {
  const { isLoadingFirstPage, results } = useInfiniteQuery<
    { userId: string },
    string
  >(api.follows.getFollowing, { userId }, 10);

  return (
    <div>
      {results.map((r) => (
        <FollowCard isLoading={isLoadingFirstPage} userId={userId} key={r} />
      ))}
    </div>
  );
};

export default FollowingSection;
