import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { addNotification, addPostNotification } from "./helpers/notifications";
import { getLoggedUser } from "./helpers/users";

export const likePost = mutation({
  args: {
    postId: v.id("posts"),
  },
  handler: async (ctx, args) => {
    const loggedUser = await getLoggedUser(ctx);
    if (!loggedUser) throw new Error("Unauthorized. You are not logged in.");

    const post = await ctx.db.get(args.postId);
    if (!post) throw new Error("Post not found");

    const existingLike = await ctx.db
      .query("likes")
      .withIndex("by_likerId_postId", (q) =>
        q.eq("likerId", loggedUser.id).eq("postId", args.postId)
      )
      .unique();

    if (existingLike) throw new Error("You already liked this post.");

    const likeId = await ctx.db.insert("likes", {
      postId: args.postId,
      likerId: loggedUser.id,
    });

    await ctx.db.patch(args.postId, {
      likes: post.likes + 1,
    });

    await addPostNotification({
      ctx,
      source: {
        action: "like",
        postId: post._id,
      },
    });
    return likeId;
  },
});

export const unlikePost = mutation({
  args: {
    postId: v.id("posts"),
  },
  handler: async (ctx, args) => {
    const loggedUser = await getLoggedUser(ctx);
    if (!loggedUser) throw new Error("Unauthorized. You are not logged in.");

    const post = await ctx.db.get(args.postId);
    if (!post) throw new Error("Post Not Found");

    const existingLike = await ctx.db
      .query("likes")
      .withIndex("by_likerId_postId", (q) =>
        q.eq("likerId", loggedUser.id).eq("postId", args.postId)
      )
      .unique();

    if (!existingLike) throw new Error("You have not liked this post.");

    await ctx.db.delete(existingLike._id);

    await ctx.db.patch(args.postId, {
      likes: Math.max((post.likes ?? 0) - 1, 0),
    });

    return { success: true };
  },
});
