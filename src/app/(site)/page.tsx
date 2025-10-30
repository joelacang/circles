"use client";
import ProfileHoverCard from "@/features/profiles/components/profile-hover-card";

import { useUser } from "@clerk/nextjs";

const SitePage = () => {
  const { user } = useUser();
  if (!user) return null;

  const { id, firstName, lastName, username, imageUrl } = user;
  return (
    <div className="border w-full max-w-sm">
      <div className="flex gap-4 items-center justify-start">
        <ProfileHoverCard
          user={{ id, firstName, lastName, username, imageUrl }}
        />
      </div>
    </div>
  );
};

export default SitePage;
