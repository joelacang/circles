import { useQuery } from "convex/react";
import { Id } from "../../../../convex/_generated/dataModel";
import { api } from "../../../../convex/_generated/api";
import { useGetUserDetails } from "@/features/users/hooks/use-get-user-details";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CommentCard from "@/features/comments/components/comment-card";
import PostCard from "./post-card";
import PostCardSkeleton from "./post-card-skeleton";

interface Props {
  postId: Id<"posts">;
}

const PostLoader = ({ postId }: Props) => {
  const post = useQuery(api.posts.getPostDetail, { postId });
  const { user, loading } = useGetUserDetails(post?.authorId ?? "");

  if (post === undefined || loading) {
    return (
      <div className="w-full flex flex-col items-center justify-center text-primary py-8">
        <PostCardSkeleton />
      </div>
    );
  }

  if (!post && !user) {
    return (
      <div className="text-destructive">
        <p>Error loading Post.</p>
      </div>
    );
  }

  return (
    <div className="py-8 px-4">
      <PostCard detailsPage post={{ ...post, author: user }} />
      <div className="py-4 w-full flex items-center justify-between">
        <p>
          <span className="text-primary font-semibold">12</span>&nbsp;comments
        </p>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Order By" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Most Recent</SelectItem>
            <SelectItem value="popular">Most Liked</SelectItem>
            <SelectItem value="commented">Most Commented</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-4">
        <CommentCard />
        {/* With Child Comments */}
        <div className="space-y-4">
          <div className="relative">
            <CommentCard />
            {/* FOR PARENT COMMENT */}
            <div className="w-px h-full bg-border absolute top-8 left-4" />
          </div>

          <div className="pl-10 space-y-4">
            <div className="relative">
              <CommentCard />
              <div className="w-6 h-px absolute top-4 -left-6 bg-border" />
              <div className="w-px h-[calc(100%+16px)] bg-border absolute top-4 -left-6" />
            </div>

            <div className="relative">
              <CommentCard />
              <div className="w-6 h-px bg-border absolute top-4 -left-6" />
            </div>
          </div>
        </div>

        <CommentCard />
        <CommentCard />
      </div>
    </div>
  );
};

export default PostLoader;
