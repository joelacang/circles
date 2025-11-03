import LoadingMessage from "@/components/loading-message";
import UserItem from "@/features/users/components/user-item";
import { useGetUserDetails } from "@/features/users/hooks/use-get-user-details";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { CheckCircle2, UserPlus } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import FollowButton from "./follow-button";
import UserItemSkeleton from "@/features/users/components/user-item-skeleton";

interface Props {
  userId: string;
  isLoading?: boolean;
}
const FollowCard = ({ userId, isLoading = false }: Props) => {
  const { user, loading, error } = useGetUserDetails(userId);
  const { user: loggedUser } = useUser();
  const isFollowing = useQuery(api.follows.getIsFollowing, {
    userIdToCheck: userId,
  });

  if (loading || isLoading || isFollowing === undefined) {
    return <UserItemSkeleton />;
  }

  if (!user) {
    return <p>User not found.</p>;
  }

  if (error) {
    return <p>Error Loading User: {error}</p>;
  }

  return (
    <div className="w-full flex items-center justify-between">
      <UserItem
        user={user}
        subtitle={user.username ? `@${user.username}` : ""}
        mode="click"
      />
      {loggedUser?.id !== user.id && (
        <>
          {isFollowing ? (
            <Button disabled>
              <CheckCircle2 />
              Followed
            </Button>
          ) : (
            <FollowButton user={user} />
          )}
        </>
      )}
    </div>
  );
};

export default FollowCard;
