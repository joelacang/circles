import { Button } from "@/components/ui/button";
import { useConvexMutationHandler } from "@/hooks/use-convex-mutation-handler";
import { Loader2Icon, User, UserPlus } from "lucide-react";
import { api } from "../../../../convex/_generated/api";
import { useMutation } from "convex/react";
import toast from "react-hot-toast";
import ToastMessage from "@/components/toast-message";
import { MODE } from "@/types/enum";
import { UserPreview } from "@/features/users/types";
import { useRouter } from "next/navigation";

interface Props extends React.ComponentProps<"button"> {
  user: UserPreview;
}

const FollowButton = ({ user }: Props) => {
  const followFn = useMutation(api.follows.followUser);
  const { mutate: followUser, isLoading } = useConvexMutationHandler(followFn);
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

  return (
    <Button onClick={handleFollow} disabled={isLoading}>
      {isLoading ? (
        <>
          <Loader2Icon className="animate-spin" />
          Following...
        </>
      ) : (
        <>
          <UserPlus />
          Follow
        </>
      )}
    </Button>
  );
};

export default FollowButton;
