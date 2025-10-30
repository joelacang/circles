import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getFollowData, isFollowing } from "./helpers/follows";
import { updateStats } from "./helpers/stats";

export const followUser = mutation({
  args: { userIdToFollow: v.string() },
  handler: async (ctx, args) => {
    const userIdentity = await ctx.auth.getUserIdentity();

    if (!userIdentity) throw new Error("Unauthorized. You are not logged in.");
    const loggedUserId = userIdentity.subject;

    if (args.userIdToFollow === loggedUserId)
      throw new Error("You cannot follow your own account.");

    const followData = await getFollowData({
      ctx,
      followedUserId: args.userIdToFollow,
    });

    if (followData) throw new Error("You are already following the user.");

    const followId = await ctx.db.insert("follows", {
      followedUserId: args.userIdToFollow,
      followedByUserId: loggedUserId,
    });

    //Update user stats
    await Promise.all([
      updateStats({
        ctx,
        clerkId: args.userIdToFollow,
        mode: "add",
        field: "followers",
      }),
      await updateStats({
        ctx,
        clerkId: loggedUserId,
        mode: "add",
        field: "following",
      }),
    ]);

    return followId;
  },
});

export const unfollowUser = mutation({
  args: { userIdToUnfollow: v.string() },
  handler: async (ctx, args) => {
    const userIdentity = await ctx.auth.getUserIdentity();

    if (!userIdentity) throw new Error("Unauthorized. You are not logged in.");
    const loggedUserId = userIdentity.subject;

    if (loggedUserId === args.userIdToUnfollow)
      throw new Error("You cannot unfollow your own account.");

    const followData = await getFollowData({
      ctx,
      followedUserId: args.userIdToUnfollow,
    });

    if (!followData) throw new Error("Follow record not found.");

    await ctx.db.delete(followData._id);

    await Promise.all([
      updateStats({
        ctx,
        clerkId: args.userIdToUnfollow,
        mode: "deduct",
        field: "followers",
      }),
      updateStats({
        ctx,
        clerkId: loggedUserId,
        mode: "deduct",
        field: "following",
      }),
    ]);
  },
});

export const getIsFollowing = query({
  args: { userIdToCheck: v.string() },
  handler: async (ctx, args) => {
    return await isFollowing({ ctx, userIdToCheck: args.userIdToCheck });
  },
});
