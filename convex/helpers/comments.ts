import { Id } from "../_generated/dataModel";
import { QueryCtx } from "../_generated/server";

export async function getCommentStatus(
  ctx: QueryCtx,
  commentId: Id<"comments">
): Promise<{ isLiked: boolean }> {
  const userIdentity = await ctx.auth.getUserIdentity();
  if (!userIdentity) return { isLiked: false };

  const isLiked = await ctx.db
    .query("commentLikes")
    .withIndex("by_likerId_commentId", (q) =>
      q.eq("likerId", userIdentity.subject).eq("commentId", commentId)
    )
    .unique();

  return { isLiked: Boolean(isLiked) };
}
