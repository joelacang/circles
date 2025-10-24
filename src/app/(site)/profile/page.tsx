"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import PostCard from "@/features/posts/components/post-card";
import UserPosts from "@/features/posts/components/user-posts";
import ProfileCount from "@/features/users/components/profile-count";
import UserAvatar from "@/features/users/components/user-avatar";
import { SIZE } from "@/types/enum";
import { useUser } from "@clerk/nextjs";
import { GlobeIcon, UserPlusIcon } from "lucide-react";

const ProfilePage = () => {
  const { user } = useUser();
  return (
    <div className="pt-8 px-6">
      <div className="flex w-full flex-col lg:flex-row items-start justify-start gap-8">
        <div className="w-full lg:w-fit flex flex-col gap-4 items-center justify-center lg:justify-start">
          <UserAvatar imageUrl={user?.imageUrl} size={SIZE.XLARGE} />
          <Button>
            <UserPlusIcon />
            Follow
          </Button>
        </div>

        <div className="pt-4 w-full  space-y-4">
          <div className="flex flex-col items-center lg:items-start">
            <p className="text-xl font-bold">{user?.fullName}</p>
            <p className="text-base text-muted-foreground">@{user?.username}</p>
          </div>

          <div className="flex flex-1  w-full">
            <div className="grid grid-cols-3 w-full gap-4 py-4">
              <ProfileCount label="Followers" count={123} />
              <ProfileCount label="Following" count={456} />
              <ProfileCount label="Post" count={789} />
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex flex-row items-center justify-center lg:justify-start gap-2">
              <GlobeIcon className="size-4" />
              <p className="text-sm ">http://website-link-her.com</p>
            </div>
            <p className="text-sm">
              Building community through ideas, stories, and good vibes. 📍
              Global citizen | 💡 Sharing what inspires me | ☕ Coffee over
              chaos | #StayConnected
            </p>
          </div>
        </div>
      </div>
      <div className="py-8 space-y-4">
        {/* <PostCard />
        <PostCard />
        <PostCard />
        <PostCard /> */}
        {user && <UserPosts userId={user.id} />}
      </div>
    </div>
  );
};

export default ProfilePage;
