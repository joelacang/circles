import UserItem from "@/features/users/components/user-item";
import { MessageCircleIcon, RepeatIcon } from "lucide-react";
import PostActionButton from "./post-action-button";
import PostDropdownMenu from "./post-dropdown-menu";
import { useState } from "react";
import CommentBox from "@/features/comments/components/comment-box";
import { Post } from "@/features/posts/types";
import { formatDistanceToNowStrict } from "date-fns";
import LikePostButton from "./like-post-button";
import BookmarkPostButton from "./bookmark-post-button";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

const PostCardSkeleton = () => {
  return (
    <div className="w-full border rounded-xl ">
      {/* Header */}
      <div className="flex p-4 items-center justify-between w-full">
        <div className="flex flex-row items-start justify-start gap-4">
          <Skeleton className="size-12 rounded-full" />
          <div className="space-y-1">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
        <Skeleton className="size-8 rounded-full" />
      </div>

      {/* Body */}
      <div className="p-4 w-full space-y-1">
        <Skeleton className="w-full h-4" />
        <Skeleton className="w-full h-4" />
        <Skeleton className="w-full h-4" />
      </div>

      {/* Attachments */}
      {/* <div className="flex flex-row gap-4 w-full overflow-x-auto p-2">
        <div className="h-64 aspect-[] relative">
          <Image
            src="/images/pic1.jpg"
            fill
            alt="Image1"
            className="object-cover"
          />
        </div>
      </div> */}

      {/* Footer */}
      <div className="py-2">
        <div className="flex flex-row items-center justify-between py-2 px-4">
          <div className="flex items-center  justify-start gap-4">
            <div className="flex flex-row items-center justify-center gap-2">
              <Skeleton className="size-6 rounded-full" />
              <Skeleton className="h-4 w-6" />
            </div>
            <div className="flex flex-row items-center justify-center gap-2">
              <Skeleton className="size-6 rounded-full" />
              <Skeleton className="h-4 w-6" />
            </div>
            <div className="flex flex-row items-center justify-center gap-2">
              <Skeleton className="size-6 rounded-full" />
              <Skeleton className="h-4 w-6" />
            </div>
          </div>
          <div className="flex flex-row items-center justify-center gap-2">
            <Skeleton className="size-6 rounded-full" />
            <Skeleton className="h-4 w-6" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCardSkeleton;
