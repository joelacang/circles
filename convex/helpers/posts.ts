import { Post } from "@/features/posts/types";
import { Doc, Id } from "../_generated/dataModel";
import { QueryCtx } from "../_generated/server";
import { AUDIENCE } from "@/types/enum";
import { getLoggedUser, getUserPreview } from "./users";
import { getPostAttachments } from "./postAttachments";

export async function getPostStatus(
  ctx: QueryCtx,
  postId: Id<"posts">
): Promise<{
  isLiked: boolean;
  isBookmarked: boolean;
}> {
  const loggedUser = await getLoggedUser(ctx);

  if (!loggedUser) return { isLiked: false, isBookmarked: false };

  const isLiked = await ctx.db
    .query("likes")
    .withIndex("by_likerId_postId", (q) =>
      q.eq("likerId", loggedUser.id).eq("postId", postId)
    )
    .unique();

  const isBookmarked = await ctx.db
    .query("bookmarks")
    .withIndex("by_postId_bookmarkerId", (q) =>
      q.eq("postId", postId).eq("bookmarkerId", loggedUser.id)
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
  const { _id, _creationTime, audience, authorId, ...others } = post;
  const status = await getPostStatus(ctx, _id);

  const authorData = await ctx.db.get(authorId);
  const attachments = await getPostAttachments({ ctx, postId: _id });

  if (!authorData) throw new Error("Author Data not found.");

  return {
    ...others,
    id: _id,
    dateCreated: _creationTime,
    author: getUserPreview(authorData),
    audience:
      Object.values(AUDIENCE).find((a) => a === audience) ?? AUDIENCE.PUBLIC,
    isLiked: status.isLiked,
    isBookmarked: status.isBookmarked,
    attachments,
  } satisfies Post;
}
