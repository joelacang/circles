import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const likePost = mutation({
  args: {
    postId: v.id("posts"),
  },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.postId);
    if (!post) throw new Error("Post not found");

    const userIdentity = await ctx.auth.getUserIdentity();
    if (!userIdentity) throw new Error("Unauthorized. You are not logged in.");

    const existingLike = await ctx.db
      .query("likes")
      .withIndex("by_likerId_postId", (q) =>
        q.eq("likerId", userIdentity.subject).eq("postId", args.postId)
      )
      .unique();

    if (existingLike) throw new Error("You already liked this post.");

    const likeId = await ctx.db.insert("likes", {
      postId: args.postId,
      likerId: userIdentity.subject,
    });

    await ctx.db.patch(args.postId, {
      likes: post.likes + 1,
    });

    return likeId;
  },
});

export const unlikePost = mutation({
  args: {
    postId: v.id("posts"),
  },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.postId);
    if (!post) throw new Error("Post Not Found");

    const userIdentity = await ctx.auth.getUserIdentity();
    if (!userIdentity) throw new Error("Unauthorized. You are not logged in.");

    const existingLike = await ctx.db
      .query("likes")
      .withIndex("by_likerId_postId", (q) =>
        q.eq("likerId", userIdentity.subject).eq("postId", args.postId)
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
