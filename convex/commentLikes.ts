import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { addNotification } from "./helpers/notifications";

export const likeComment = mutation({
  args: {
    commentId: v.id("comments"),
  },
  handler: async (ctx, args) => {
    const comment = await ctx.db.get(args.commentId);
    if (!comment) throw new Error("Comment not found");

    const userIdentity = await ctx.auth.getUserIdentity();
    if (!userIdentity) throw new Error("Unauthorized. You are not logged in.");

    const existingLike = await ctx.db
      .query("commentLikes")
      .withIndex("by_likerId_commentId", (q) =>
        q.eq("likerId", userIdentity.subject).eq("commentId", args.commentId)
      )
      .unique();

    if (existingLike) throw new Error("You already liked this comment.");

    const likeId = await ctx.db.insert("commentLikes", {
      commentId: args.commentId,
      likerId: userIdentity.subject,
    });

    await ctx.db.patch(args.commentId, {
      likes: comment.likes + 1,
    });

    await addNotification({
      ctx,
      recipientId: comment.authorId,
      source: {
        action: "like",
        commentId: comment._id,
      },
    });
    return likeId;
  },
});

export const unlikeComment = mutation({
  args: {
    commentId: v.id("comments"),
  },
  handler: async (ctx, args) => {
    const comment = await ctx.db.get(args.commentId);
    if (!comment) throw new Error("Post Not Found");

    const userIdentity = await ctx.auth.getUserIdentity();
    if (!userIdentity) throw new Error("Unauthorized. You are not logged in.");

    const existingLike = await ctx.db
      .query("commentLikes")
      .withIndex("by_likerId_commentId", (q) =>
        q.eq("likerId", userIdentity.subject).eq("commentId", args.commentId)
      )
      .unique();

    if (!existingLike) throw new Error("You have not liked this post.");

    await ctx.db.delete(existingLike._id);

    await ctx.db.patch(args.commentId, {
      likes: Math.max((comment.likes ?? 0) - 1, 0),
    });

    return { success: true };
  },
});
