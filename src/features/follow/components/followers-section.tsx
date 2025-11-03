import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useInfiniteQuery } from "@/hooks/use-infinite-query";
import LoadingMessage from "@/components/loading-message";
import FollowCard from "./follow-card";

interface Props {
  userId: string;
}

const FollowersSection = ({ userId }: Props) => {
  const { isLoadingFirstPage, results } = useInfiniteQuery<
    { userId: string },
    string
  >(api.follows.getFollowers, { userId }, 10);

  return (
    <div>
      {results.map((r) => (
        <FollowCard isLoading={isLoadingFirstPage} userId={r} key={r} />
      ))}
    </div>
  );
};

export default FollowersSection;
