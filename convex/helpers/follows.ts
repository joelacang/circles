import { Doc } from "../_generated/dataModel";
import { QueryCtx } from "../_generated/server";

export async function isFollowing({
  ctx,
  userIdToCheck,
}: {
  ctx: QueryCtx;
  userIdToCheck: string;
}): Promise<boolean> {
  const userIdentity = await ctx.auth.getUserIdentity();

  if (!userIdentity) throw new Error("Unauthorized. You are not logged in.");

  const followData = await ctx.db
    .query("follows")
    .withIndex("by_followedUserId_followedByUserId", (q) =>
      q
        .eq("followedUserId", userIdToCheck)
        .eq("followedByUserId", userIdentity.subject)
    )
    .unique();

  return Boolean(followData);
}

export async function getFollowData({
  ctx,
  followedUserId,
}: {
  ctx: QueryCtx;
  followedUserId: string;
}): Promise<Doc<"follows"> | null> {
  const userIdentity = await ctx.auth.getUserIdentity();

  if (!userIdentity) throw new Error("Unauthorized. You are not logged in.");

  const loggedUserId = userIdentity.subject;

  return await ctx.db
    .query("follows")
    .withIndex("by_followedUserId_followedByUserId", (q) =>
      q
        .eq("followedUserId", followedUserId)
        .eq("followedByUserId", loggedUserId)
    )
    .unique();
}
