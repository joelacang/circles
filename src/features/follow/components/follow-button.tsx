import { Button } from "@/components/ui/button";
import { useConvexMutationHandler } from "@/hooks/use-convex-mutation-handler";
import {
  Loader2Icon,
  User,
  UserCheck,
  UserMinus,
  UserPlus,
} from "lucide-react";
import { api } from "../../../../convex/_generated/api";
import { useMutation } from "convex/react";
import toast from "react-hot-toast";
import ToastMessage from "@/components/toast-message";
import { MODE } from "@/types/enum";
import { UserPreview } from "@/features/users/types";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface Props extends React.ComponentProps<"button"> {
  user: UserPreview;
  isFollowing?: boolean;
}

const FollowButton = ({ user, isFollowing = false }: Props) => {
  const followFn = useMutation(api.follows.followUser);
  const unfollowFn = useMutation(api.follows.unfollowUser);
  const { mutate: followUser, isLoading: followingUser } =
    useConvexMutationHandler(followFn);
  const { mutate: unfollowUser, isLoading: unfollowingUser } =
    useConvexMutationHandler(unfollowFn);
  const [hovered, setHovered] = useState(false);

  const isLoading = followingUser || unfollowingUser;

  const router = useRouter();

  const handleFollow = () => {
    followUser(
      { userIdToFollow: user.id },
      {
        onLoading: () => {
          toast.custom(
            () => (
              <ToastMessage
                mode={MODE.LOADING}
                description={`Following the user @${user.username ?? "user"}...`}
              />
            ),
            { id: "follow-user-toast" }
          );
        },
        onSuccess: () => {
          toast.custom(() => (
            <ToastMessage
              mode={MODE.SUCCESS}
              message="Follow successful."
              description={`You’re now following @${user.username ?? "user"} — their updates will show up in your feed!`}
              footer={
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    router.push(`/@${user.username}`);
                  }}
                >
                  <User />
                  Check Profile
                </Button>
              }
            />
          ));
        },
        onError: (error) => {
          toast.custom(() => (
            <ToastMessage
              mode={MODE.ERROR}
              message="Error following user."
              description={`Error following the user @${user.username ?? "user"}: ${error}`}
            />
          ));
        },
        onSettled: () => {
          toast.dismiss("follow-user-toast");
        },
      }
    );
  };

  const handleUnFollow = () => {
    unfollowUser(
      { userIdToUnfollow: user.id },
      {
        onLoading: () => {
          toast.custom(
            () => (
              <ToastMessage
                mode={MODE.LOADING}
                description={`Unfollowing the user @${user.username ?? "user"}...`}
              />
            ),
            { id: "unfollow-user-toast" }
          );
        },
        onSuccess: () => {
          toast.custom(() => (
            <ToastMessage
              mode={MODE.SUCCESS}
              message="User no longer followed."
              description={`You’re no longer following @${user.username ?? "user"} — their updates will not show up in your feed anymore!`}
            />
          ));
        },
        onError: (error) => {
          toast.custom(() => (
            <ToastMessage
              mode={MODE.ERROR}
              message="Error unfollowing user."
              description={`Error unfollowing the user @${user.username ?? "user"}: ${error}`}
            />
          ));
        },
        onSettled: () => {
          toast.dismiss("unfollow-user-toast");
        },
      }
    );
  };

  return (
    <Button
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        if (isFollowing) {
          handleUnFollow();
        } else {
          handleFollow();
        }
      }}
      disabled={isLoading}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      variant={isFollowing ? "default" : "outline"}
      className={cn(
        isFollowing
          ? "bg-primary hover:bg-destructive"
          : "bg-transparent border-primary text-primary hover:text-primary",
        " rounded-full"
      )}
    >
      {isLoading ? (
        <>
          <Loader2Icon className="animate-spin" />
          Following...
        </>
      ) : (
        <>
          {isFollowing ? hovered ? <UserMinus /> : <UserCheck /> : <UserPlus />}
          {isFollowing ? (hovered ? "Unfollow" : "Followed") : "Follow"}
        </>
      )}
    </Button>
  );
};

export default FollowButton;
