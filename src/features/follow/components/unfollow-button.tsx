import { Button } from "@/components/ui/button";
import { useConvexMutationHandler } from "@/hooks/use-convex-mutation-handler";
import { Loader2Icon, UserMinus } from "lucide-react";
import { api } from "../../../../convex/_generated/api";
import { useMutation } from "convex/react";
import toast from "react-hot-toast";
import ToastMessage from "@/components/toast-message";
import { MODE } from "@/types/enum";
import { UserPreview } from "@/features/users/types";

interface Props extends React.ComponentProps<"button"> {
  user: UserPreview;
}

const UnfollowButton = ({ user }: Props) => {
  const unfollowFn = useMutation(api.follows.unfollowUser);
  const { mutate: followUser, isLoading } =
    useConvexMutationHandler(unfollowFn);

  const handleUnfollow = () => {
    followUser(
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
              message={`@${user.username} unfollowed.`}
              description={`You have unfollowed the user @${user.username ?? "user"}. You’ll no longer see their updates in your feed.`}
            />
          ));
        },
        onError: (error) => {
          toast.custom(() => (
            <ToastMessage
              mode={MODE.ERROR}
              message={`Error unfollowing the user @${user.username ?? "user"}: ${error}`}
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
    <Button onClick={handleUnfollow} disabled={isLoading}>
      {isLoading ? (
        <>
          <Loader2Icon className="animate-spin" />
          Unfollowing...
        </>
      ) : (
        <>
          <UserMinus />
          Unfollow
        </>
      )}
    </Button>
  );
};

export default UnfollowButton;
