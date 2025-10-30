import { useGetUserByUsername } from "@/features/users/hooks/use-get-user-by-username";
import ProfileLoader from "./profile-loader";
import InfoMessage from "@/components/info-message";
import ProfileSectionSkeleton from "./profile-section-skeleton";

interface Props {
  username: string;
}
const ProfileLoaderByUsername = ({ username }: Props) => {
  const { user, loading } = useGetUserByUsername(username);

  if (loading) {
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
