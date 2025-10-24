import { Post } from "@/features/posts/types";
import { Doc, Id } from "../_generated/dataModel";
import { QueryCtx } from "../_generated/server";
import { AUDIENCE } from "@/types/enum";

export async function getPostStatus(
  ctx: QueryCtx,
  postId: Id<"posts">
): Promise<{
  isLiked: boolean;
  isBookmarked: boolean;
}> {
  const userIdentity = await ctx.auth.getUserIdentity();

  if (!userIdentity) return { isLiked: false, isBookmarked: false };

  const isLiked = await ctx.db
    .query("likes")
    .withIndex("by_likerId_postId", (q) =>
      q.eq("likerId", userIdentity.subject).eq("postId", postId)
    )
    .unique();

  const isBookmarked = await ctx.db
    .query("bookmarks")
    .withIndex("by_postId_bookmarkerId", (q) =>
      q.eq("postId", postId).eq("bookmarkerId", userIdentity.subject)
    )
    .unique();

  return {
    isLiked: Boolean(isLiked),
    isBookmarked: Boolean(isBookmarked),
  };
}

export async function getPostData(
  ctx: QueryCtx,
  post: Doc<"posts">
): Promise<Post> {
  const { _id, _creationTime, audience, ...others } = post;
  const status = await getPostStatus(ctx, _id);

  return {
    ...others,
    id: _id,
    dateCreated: _creationTime,
    author: null,
    attachments: [],
    audience:
      Object.values(AUDIENCE).find((a) => a === audience) ?? AUDIENCE.PUBLIC,
    isLiked: status.isLiked,
    isBookmarked: status.isBookmarked,
  };
}
