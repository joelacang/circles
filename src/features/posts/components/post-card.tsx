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

interface Props {
  post: Post;
  detailsPage?: boolean;
}

const PostCard = ({ post, detailsPage = false }: Props) => {
  const [showCommentBox, setShowCommentBox] = useState(false);
  const router = useRouter();

  return (
    <div
      className={cn(
        "w-full border rounded-xl ",
        !detailsPage && "hover:bg-muted hover:cursor-pointer"
      )}
      onClick={() => {
        if (!detailsPage) {
          router.push(`/posts/${post.id}`);
        }
      }}
    >
      {/* Header */}
      <div className="flex pr-4 items-center justify-between w-full">
        {post.author && (
          <UserItem
            user={post.author}
            subtitle={`${formatDistanceToNowStrict(new Date(post.dateCreated))} ago`}
          />
        )}
        <PostDropdownMenu />
      </div>

      {/* Body */}
      <div className="p-4">
        <p className="text-sm">{post.body}</p>
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
        {showCommentBox && <CommentBox postId={post.id} />}
      </div>
    </div>
  );
};

export default PostCard;
