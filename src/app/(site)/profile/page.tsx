"use client";

import { useUser } from "@clerk/nextjs";
import ProfileLoader from "@/features/profiles/components/profile-loader";
import InfoMessage from "@/components/info-message";

const MyProfilePage = () => {
  const { user } = useUser();

  if (!user) {
    return (
      <InfoMessage
        message="You are not logged in."
        imageUrl="/images/error.png"
        className="max-w-[324px]"
      />
    );
  }

  const { id, firstName, lastName, imageUrl, username } = user;

  return (
    <div>
      {user?.id && (
        <ProfileLoader
          user={{
            id,
            firstName,
            lastName,
            imageUrl,
            username,
          }}
        />
      )}
    </div>
  );
};

export default MyProfilePage;
