"use client";

import InfoMessage from "@/components/info-message";
import ProfileLoaderByUsername from "@/features/profiles/components/profile-loader-by-username";
import { useParams } from "next/navigation";

const UserProfilePage = () => {
  const params = useParams();
  const usernameParam = params.username;

  if (!usernameParam) {
    return (
      <InfoMessage
        message="No Username found."
        imageUrl="/images/not-found.png"
        className="max-w-[324px]"
      />
    );
  }

  const decodedUsername = decodeURIComponent(usernameParam as string);

  if (!decodedUsername.startsWith("@")) {
    return (
      <InfoMessage
        message={`Username: '${decodedUsername}' is invalid`}
        imageUrl="/images/not-found.png"
        className="max-w-[324px]"
      />
    );
  }

  const username = decodedUsername.slice(1);

  return (
    <div>
      <ProfileLoaderByUsername username={username} />
    </div>
  );
};

export default UserProfilePage;
