import UserItem from "@/features/users/components/user-item";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import FollowButton from "./follow-button";
import UserItemSkeleton from "@/features/users/components/user-item-skeleton";
import { UserPreview } from "@/features/users/types";

interface Props {
  user: UserPreview;
  isLoading?: boolean;
}
const FollowCard = ({ user, isLoading = false }: Props) => {
  const { user: loggedUser } = useUser();
  const isFollowing = useQuery(api.follows.getIsFollowing, {
    userIdToCheck: user.id,
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
        <div className="px-4">
          <FollowButton user={user} isFollowing={isFollowing} />
        </div>
      )}
    </div>
  );
};

export default FollowCard;
