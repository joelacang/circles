import LoadingMessage from "@/components/loading-message";
import UserItem from "@/features/users/components/user-item";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { CheckCircle2, UserPlus } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import FollowButton from "./follow-button";
import UserItemSkeleton from "@/features/users/components/user-item-skeleton";
import { Id } from "../../../../convex/_generated/dataModel";

interface Props {
  userId: Id<"users">;
  isLoading?: boolean;
}
const FollowCard = ({ userId, isLoading = false }: Props) => {
  const user = useQuery(api.users.getUserById, { userId });
  const { user: loggedUser } = useUser();
  const isFollowing = useQuery(api.follows.getIsFollowing, {
    userIdToCheck: userId,
  });

  if (user === undefined || isLoading || isFollowing === undefined) {
    return <UserItemSkeleton />;
  }

  if (!user) {
    return <p>User not found.</p>;
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
