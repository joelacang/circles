"use client";

import { useUser } from "@clerk/nextjs";
import ProfileLoader from "@/features/profiles/components/profile-loader";
import InfoMessage from "@/components/info-message";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import ProfileSectionSkeleton from "@/features/profiles/components/profile-section-skeleton";

const MyProfilePage = () => {
  const user = useQuery(api.users.getLoggedUserQuery);

  if (user === undefined) {
    return <ProfileSectionSkeleton />;
  }

  if (!user) {
    return (
      <InfoMessage
        message="You are not logged in."
        imageUrl="/images/error.png"
        className="max-w-[324px]"
      />
    );
  }

  return (
    <div>
      <ProfileLoader user={user} />
    </div>
  );
};

export default MyProfilePage;
