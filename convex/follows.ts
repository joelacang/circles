import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getFollowData, isFollowing } from "./helpers/follows";
import { updateStats } from "./helpers/stats";
import { paginationOptsValidator } from "convex/server";
import { addNotification } from "./helpers/notifications";
import { getLoggedUser, getUser } from "./helpers/users";
import { getUserById } from "./users";

export const followUser = mutation({
  args: { userIdToFollow: v.id("users") },
  handler: async (ctx, args) => {
    const loggedUser = await getLoggedUser(ctx);
    if (!loggedUser) throw new Error("Unauthorized. You are not logged in.");

    if (args.userIdToFollow === loggedUser.id)
      throw new Error("You cannot follow your own account.");

    const followData = await getFollowData({
      ctx,
      followedUserId: args.userIdToFollow,
    });

    if (followData) throw new Error("You are already following the user.");

    const followId = await ctx.db.insert("follows", {
      followedUserId: args.userIdToFollow,
      followedByUserId: loggedUser.id,
    });

    //Update user stats
    await Promise.all([
      updateStats({
        ctx,
        userId: args.userIdToFollow,
        mode: "add",
        field: "followers",
      }),
      await updateStats({
        ctx,
        userId: loggedUser.id,
        mode: "add",
        field: "following",
      }),
    ]);

    await addNotification({
      ctx,
      recipients: [{ id: args.userIdToFollow, type: "follow" }],
      source: { action: "follow", followedUserId: args.userIdToFollow },
    });

    return followId;
  },
});

export const unfollowUser = mutation({
  args: { userIdToUnfollow: v.id("users") },
  handler: async (ctx, args) => {
    const loggedUser = await getLoggedUser(ctx);
    if (!loggedUser) throw new Error("Unauthorized. You are not logged in.");

    if (loggedUser.id === args.userIdToUnfollow)
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
        userId: args.userIdToUnfollow,
        mode: "deduct",
        field: "followers",
      }),
      updateStats({
        ctx,
        userId: loggedUser.id,
        mode: "deduct",
        field: "following",
      }),
    ]);
  },
});

export const getIsFollowing = query({
  args: { userIdToCheck: v.id("users") },
  handler: async (ctx, args) => {
    return await isFollowing({ ctx, userIdToCheck: args.userIdToCheck });
  },
});

export const getFollowers = query({
  args: { paginationOpts: paginationOptsValidator, userId: v.id("users") },
  handler: async (ctx, args) => {
    const followerResults = await ctx.db
      .query("follows")
      .withIndex("by_followedUserId", (q) =>
        q.eq("followedUserId", args.userId)
      )
      .paginate(args.paginationOpts);

    const followers = (
      await Promise.all(
        followerResults.page.map(async (result) => {
          return await getUser({ ctx, userId: result.followedByUserId });
        })
      )
    ).filter((u) => u !== null);

    return {
      ...followers,
      page: followers,
    };
  },
});

export const getFollowing = query({
  args: { paginationOpts: paginationOptsValidator, userId: v.id("users") },
  handler: async (ctx, args) => {
    const followings = await ctx.db
      .query("follows")
      .withIndex("by_followedByUserId", (q) =>
        q.eq("followedByUserId", args.userId)
      )
      .paginate(args.paginationOpts);

    const followingIds = followings.page.map((f) => f.followedUserId);

    return {
      ...followings,
      page: followingIds,
    };
  },
});
