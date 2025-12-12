import { useInfiniteQuery } from "@/hooks/use-infinite-query";
import { api } from "../../../../convex/_generated/api";
import UserItemSkeleton from "@/features/users/components/user-item-skeleton";
import { UserPreview } from "@/features/users/types";
import InfoMessage from "@/components/info-message";
import FollowCard from "@/features/follow/components/follow-card";

interface Props {
  searchValue: string;
}
const SearchResults = ({ searchValue }: Props) => {
  const { isLoadingFirstPage, results } = useInfiniteQuery<
    { searchValue: string },
    UserPreview
  >(api.users.searchUser, { searchValue }, 25);

  if (isLoadingFirstPage) {
    return (
      <div>
        <UserItemSkeleton />
        <UserItemSkeleton />
        <UserItemSkeleton />
        <UserItemSkeleton />
      </div>
    );
  }

  if (!results || results.length < 1) {
    return (
      <div className="flex flex-col items-center justify-center w-full px-4">
        <InfoMessage
          imageUrl="/images/not-found.png"
          message={`No Results found for: '${searchValue}'`}
        />
      </div>
    );
  }
  return (
    <div>
      <div className="px-2 pb-4">
        Search Results for:{" "}
        <span className="text-primary font-semibold">
          &apos;{searchValue}&apos;
        </span>
      </div>
      {results.map((result) => (
        <div key={result.id} className="cursor-pointer hover:bg-accent">
          <FollowCard user={result} />
        </div>
      ))}
    </div>
  );
};

export default SearchResults;
