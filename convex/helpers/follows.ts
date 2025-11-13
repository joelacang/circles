import { Doc, Id } from "../_generated/dataModel";
import { QueryCtx } from "../_generated/server";
import { getLoggedUser } from "./users";

export async function isFollowing({
  ctx,
  userIdToCheck,
}: {
  ctx: QueryCtx;
  userIdToCheck: Id<"users">;
}): Promise<boolean> {
  const loggedUser = await getLoggedUser(ctx);
  if (!loggedUser) throw new Error("Unauthorized. You are not logged in.");

  const followData = await ctx.db
    .query("follows")
    .withIndex("by_followedUserId_followedByUserId", (q) =>
      q
        .eq("followedUserId", userIdToCheck)
        .eq("followedByUserId", loggedUser.id)
    )
    .unique();

  return Boolean(followData);
}

export async function getFollowData({
  ctx,
  followedUserId,
}: {
  ctx: QueryCtx;
  followedUserId: Id<"users">;
}): Promise<Doc<"follows"> | null> {
  const loggedUser = await getLoggedUser(ctx);
  if (!loggedUser) throw new Error("Unauthorized. You are not logged in.");

  return await ctx.db
    .query("follows")
    .withIndex("by_followedUserId_followedByUserId", (q) =>
      q
        .eq("followedUserId", followedUserId)
        .eq("followedByUserId", loggedUser.id)
    )
    .unique();
}
