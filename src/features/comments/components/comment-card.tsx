import { Button } from "@/components/ui/button";
import PostActionButton from "@/features/posts/components/post-action-button";
import UserAvatar from "@/features/users/components/user-avatar";
import { SIZE } from "@/types/enum";
import { MessageCircleIcon, MoreHorizontalIcon } from "lucide-react";
import { Comment } from "../types";
import { formatDistanceToNowStrict } from "date-fns";
import CommentLikeButton from "./comment-like-button";
import { useState } from "react";
import CommentBox from "./comment-box";
import RepliesLoader from "./replies-loader";

import ProfileHoverCard from "@/features/profiles/components/profile-hover-card";

interface Props {
  comment: Comment;
  childComment?: boolean;
  level?: number;
}
const CommentCard = ({ comment, childComment = false, level = 0 }: Props) => {
  const [showCommentBox, setShowCommentBox] = useState(false);

  return (
    <div>
      <div className="relative">
        <div className="  flex w-full items-start justify-start gap-3">
          <ProfileHoverCard user={comment.author}>
            <UserAvatar imageUrl={comment.author.imageUrl} size={SIZE.MINI} />
          </ProfileHoverCard>

          <div className="w-full space-y-2">
            <div className="flex flex-row items-center justify-start gap-2">
              <ProfileHoverCard user={comment.author}>
                <Button className="text-sm size-fit p-0" variant="link">
                  {comment.author.username}
                </Button>
              </ProfileHoverCard>

              <p className="text-xs text-muted-foreground">
                {formatDistanceToNowStrict(new Date(comment.dateCreated))}
                &nbsp;ago
              </p>
              <p className="text-xs text-muted-foreground">(Edited)</p>
            </div>
            <p className=" text-sm">{comment.body}</p>
            <div className="flex flex-row gap-4">
              <CommentLikeButton
                commentId={comment.id}
                isLiked={comment.isLiked}
                count={comment.likes}
              />
              <PostActionButton
                tooltip="Comment Post"
                icon={MessageCircleIcon}
                count={comment.comments}
                action={() => setShowCommentBox((prev) => !prev)}
              />
              <Button variant="ghost" className="rounded-full">
                <MoreHorizontalIcon />
              </Button>
            </div>
            {showCommentBox && (
              <div className="w-full">
                <CommentBox
                  postId={comment.postId}
                  parentCommentId={comment.id}
                  onClose={() => setShowCommentBox(false)}
                />
              </div>
            )}
          </div>
        </div>

        {childComment && (
          <div className="bg-primary absolute top-4 -left-6 h-px w-6" />
        )}
        {/* {childComment && (
          <div
            className={cn(
              "bg-cyan-500 absolute top-0 -left-6 w-px",
              lastChildComment ? "h-4" : "h-full"
            )}
          />
        )} */}
        {comment.comments > 0 && (
          <div className="bg-primary absolute top-8 left-4 h-[calc(100%-16px)] w-px" />
        )}
      </div>

      {comment.comments > 0 && (
        <RepliesLoader
          postId={comment.postId}
          parentCommentId={comment.id}
          level={level + 1}
        />
      )}
    </div>
  );
};

export default CommentCard;
