import UserAvatar from "@/features/users/components/user-avatar";
import { Profile } from "../types";
import { UserPreview } from "@/features/users/types";
import { SIZE } from "@/types/enum";
import { GlobeIcon } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import ProfileCount from "./profile-count";
import UserPosts from "@/features/posts/components/user-posts";
import EditProfileButton from "./edit-profile-button";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Skeleton } from "@/components/ui/skeleton";
import FollowButton from "@/features/follow/components/follow-button";
import UnfollowButton from "@/features/follow/components/unfollow-button";
import { useFollowDialog } from "@/features/follow/hooks/use-follow-dialog";

interface Props {
  profile: Profile;
}

const ProfileSection = ({ profile }: Props) => {
  const { user: loggedUser } = useUser();
  const isMobile = useIsMobile();
  const { onOpen } = useFollowDialog();
  const isFollowing = useQuery(api.follows.getIsFollowing, {
    userIdToCheck: profile.user.id,
  });

  const ownProfile = loggedUser?.id === profile.user.clerkId;
  return (
    <div className="pt-8 px-6 relative">
      <div className="flex w-full flex-col lg:flex-row items-start justify-start gap-8">
        <div className="w-full lg:w-fit flex flex-col gap-4 items-center justify-center lg:justify-start">
          <UserAvatar imageUrl={profile.user.imageUrl} size={SIZE.XLARGE} />
          {!ownProfile && (
            <>
              {isFollowing === undefined ? (
                <div>
                  <Skeleton className="h-9 w-24" />
                </div>
              ) : (
                <>
                  {isFollowing ? (
                    <UnfollowButton user={profile.user} />
                  ) : (
                    <FollowButton user={profile.user} />
                  )}
                </>
              )}
            </>
          )}
        </div>
        <div className=" w-full  space-y-4">
          <div
            className={cn(
              "flex flex-row ",
              isMobile
                ? " items-center justify-center"
                : "items-start justify-between pt-4"
            )}
          >
            <div className="flex flex-col items-center lg:items-start">
              <p className="text-xl font-bold">{`${profile.user.name}`}</p>
              <p className="text-base text-muted-foreground">
                @{profile.user.username}
              </p>
            </div>
          </div>
          <div className="flex flex-1  w-full">
            <div className="grid grid-cols-3 w-full gap-4 py-4">
              <ProfileCount
                label="Followers"
                count={profile.followers}
                tooltip="Show Followers"
                action={() =>
                  onOpen({
                    user: profile.user,
                    mode: "followers",
                    count: profile.followers,
                  })
                }
              />
              <ProfileCount
                label="Following"
                count={profile.followings}
                tooltip="Show Following"
                action={() =>
                  onOpen({
                    user: profile.user,
                    mode: "following",
                    count: profile.followings,
                  })
                }
              />
              <ProfileCount
                label="Post"
                count={profile.posts}
                tooltip="Show Posts"
              />
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <div className="flex flex-row items-center justify-center lg:justify-start gap-2">
              <GlobeIcon className="size-4" />
              <p className="text-sm ">{profile.website}</p>
            </div>
            <p className="text-sm">{profile.bio}</p>
          </div>
        </div>
      </div>
      <div className="py-8 space-y-4">
        <UserPosts userId={profile.user.id} />
      </div>
      {ownProfile && (
        <div className={cn("absolute top-8 right-4")}>
          <EditProfileButton profile={profile} />
        </div>
      )}
    </div>
  );
};

export default ProfileSection;
