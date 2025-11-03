import { Button } from "@/components/ui/button";
import UserAvatar from "@/features/users/components/user-avatar";
import UserItem from "@/features/users/components/user-item";
import { UserPreview } from "@/features/users/types";
import { SIZE } from "@/types/enum";
import ProfileCount from "./profile-count";
import { User } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import LoadingMessage from "@/components/loading-message";
import InfoMessage from "@/components/info-message";
import { useUser } from "@clerk/nextjs";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useRouter } from "next/navigation";

interface Props {
  user: UserPreview;
  children: React.ReactNode;
}
const ProfileHoverCard = ({ user, children }: Props) => {
  const profile = useQuery(api.profiles.getProfile, { clerkId: user.id });
  const { user: loggedUser } = useUser();
  const router = useRouter();

  return (
    <HoverCard>
      <HoverCardTrigger
        className="cursor-pointer"
        onClick={() => router.push(`/@${user.username}`)}
      >
        {children}
      </HoverCardTrigger>
      <HoverCardContent className="w-xs mx-4">
        <div className="flex flex-col gap-2 relative w-full">
          <UserAvatar imageUrl={user.imageUrl} size={SIZE.LARGE} />
          <div className="pt-2">
            <p className="text-lg font-semibold leading-none">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-sm text-muted-foreground">@{user.username}</p>
          </div>
          {loggedUser?.id !== user.id && (
            <div className="absolute right-0 top-0">
              <Button variant="outline">Follow</Button>
            </div>
          )}
          <div className="w-full">
            {profile === undefined ? (
              <div className="w-full">
                <LoadingMessage message="Loading Profile..." />
              </div>
            ) : (
              <>
                {profile ? (
                  <div className="space-y-3">
                    <p className="text-sm line-clamp-2">{profile.bio}</p>

                    <div className="grid grid-cols-2 py-2">
                      <ProfileCount
                        label="Followers"
                        count={profile.followers}
                      />
                      <ProfileCount
                        label="Following"
                        count={profile.followings}
                      />
                    </div>

                    <Button
                      variant="outline"
                      className="rounded-full w-full"
                      onClick={() => router.push(`/@${user.username}`)}
                    >
                      <User />
                      View Profile
                    </Button>
                  </div>
                ) : (
                  <div>
                    <p>Profile Not Found.</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default ProfileHoverCard;
