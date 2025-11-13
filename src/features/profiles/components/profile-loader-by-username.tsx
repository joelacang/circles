import ProfileLoader from "./profile-loader";
import InfoMessage from "@/components/info-message";
import ProfileSectionSkeleton from "./profile-section-skeleton";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

interface Props {
  username: string;
}
const ProfileLoaderByUsername = ({ username }: Props) => {
  const user = useQuery(api.users.getUserByUsername, { username });

  if (user === undefined) {
    return <ProfileSectionSkeleton />;
  }
  if (!user) {
    return (
      <InfoMessage
        imageUrl="/images/not-found.png"
        message={`No user found with the username: ${username}`}
        className="max-w-[324px]"
      />
    );
  }

  return <ProfileLoader user={user} />;
};

export default ProfileLoaderByUsername;
