import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { UserPlusIcon } from "lucide-react";
import { useProfileDialog } from "@/features/users/hooks/use-profile-dialog";
import ProfileSection from "./profile-section";
import InfoMessage from "@/components/info-message";
import ProfileSectionSkeleton from "./profile-section-skeleton";
import { UserPreview } from "@/features/users/types";

interface Props {
  user: UserPreview;
}
const ProfileLoader = ({ user }: Props) => {
  const profile = useQuery(api.profiles.getProfile, { userId: user.id });
  const { user: clerkUser } = useUser();
  const { onOpen } = useProfileDialog();
  const ownProfile = clerkUser?.id === user.clerkId;

  if (profile === undefined) {
    return <ProfileSectionSkeleton />;
  }

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-4">
        <InfoMessage
          message={
            ownProfile
              ? "You haven't created your profile yet"
              : "This user hasn't created a profile yet."
          }
          imageUrl="/images/not-found.png"
        >
          {ownProfile && (
            <Button onClick={onOpen}>
              <UserPlusIcon />
              Create Profile.
            </Button>
          )}
        </InfoMessage>
      </div>
    );
  }

  return (
    <div>
      <ProfileSection profile={profile} />
    </div>
  );
};

export default ProfileLoader;
