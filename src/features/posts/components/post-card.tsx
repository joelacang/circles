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

import { useGetUserDetails } from "@/features/users/hooks/use-get-user-details";
import UserItemSkeleton from "@/features/users/components/user-item-skeleton";
import { TextProcessor } from "@/lib/text-processor";

interface Props {
  post: Post;
  detailsPage?: boolean;
}

const PostCard = ({ post, detailsPage = false }: Props) => {
  const [showCommentBox, setShowCommentBox] = useState(false);
  const { user: author, loading: loadingAuthor } = useGetUserDetails(
    post.authorId
  );
  const router = useRouter();

  return (
    <div
      className={cn(
        "w-full border rounded-xl ",
        !detailsPage && "hover:bg-muted hover:cursor-pointer"
      )}
    >
      <div
        onClick={() => {
          if (!detailsPage) {
            router.push(`/posts/${post.id}`);
          }
        }}
      >
        <div className="flex pr-4 items-center justify-between w-full">
          {loadingAuthor && <UserItemSkeleton />}
          {author && !loadingAuthor && (
            <UserItem
              user={author}
              subtitle={`${formatDistanceToNowStrict(new Date(post.dateCreated))} ago`}
              mode="hover"
            />
          )}
          <PostDropdownMenu />
        </div>

        {/* Body */}
        <div className="p-4">
          <TextProcessor text={post.body} />
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
        <div>
          <div className="flex flex-row items-center justify-between py-2 px-4">
            <div className="flex items-center  justify-start gap-4">
              <LikePostButton
                count={post.likes}
                postId={post.id}
                isLiked={post.isLiked}
              />
              <PostActionButton
                tooltip="Quote Post"
                icon={RepeatIcon}
                count={post.quotes}
                action={() => {}}
              />
              <PostActionButton
                tooltip="Comment Post"
                icon={MessageCircleIcon}
                count={post.comments}
                action={() => setShowCommentBox((prev) => !prev)}
              />
            </div>
            <BookmarkPostButton
              count={post.bookmarks}
              postId={post.id}
              isBookmarked={post.isBookmarked}
            />
          </div>
        </div>
      </div>

      {showCommentBox && (
        <CommentBox
          parentCommentId={null}
          postId={post.id}
          onClose={() => setShowCommentBox(false)}
        />
      )}
    </div>
  );
};

export default PostCard;
