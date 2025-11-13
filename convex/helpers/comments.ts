import { Id } from "../_generated/dataModel";
import { QueryCtx } from "../_generated/server";
import { getLoggedUser } from "./users";

export async function getCommentStatus(
  ctx: QueryCtx,
  commentId: Id<"comments">
): Promise<{ isLiked: boolean }> {
  const loggedUser = await getLoggedUser(ctx);
  if (!loggedUser) throw new Error("Unauthorized. You are not logged in.");

  const isLiked = await ctx.db
    .query("commentLikes")
    .withIndex("by_likerId_commentId", (q) =>
      q.eq("likerId", loggedUser.id).eq("commentId", commentId)
    )
    .unique();

  return { isLiked: Boolean(isLiked) };
}
