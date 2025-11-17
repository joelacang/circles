"use client";
import ProfileHoverCard from "@/features/profiles/components/profile-hover-card";

import { useUser } from "@clerk/nextjs";

const SitePage = () => {
  const { user } = useUser();
  if (!user) return null;

  const { id, firstName, lastName, username, imageUrl } = user;
  return (
    <div className="border w-full">
      <div className="flex gap-4 items-center justify-start">
        This is the home page.
      </div>
    </div>
  );
};

export default SitePage;
