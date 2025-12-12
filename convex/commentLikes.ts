import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { addNotification } from "./helpers/notifications";
import { getLoggedUser } from "./helpers/users";

export const likeComment = mutation({
  args: {
    commentId: v.id("comments"),
  },
  handler: async (ctx, args) => {
    const comment = await ctx.db.get(args.commentId);
    if (!comment) throw new Error("Comment not found");

    const loggedUser = await getLoggedUser(ctx);
    if (!loggedUser) throw new Error("Unauthorized. You are not logged in.");

    const existingLike = await ctx.db
      .query("commentLikes")
      .withIndex("by_likerId_commentId", (q) =>
        q.eq("likerId", loggedUser.id).eq("commentId", args.commentId)
      )
      .unique();

    if (existingLike) throw new Error("You already liked this comment.");

    const likeId = await ctx.db.insert("commentLikes", {
      commentId: args.commentId,
      likerId: loggedUser.id,
    });

    await ctx.db.patch(args.commentId, {
      likes: comment.likes + 1,
    });

    await addNotification({
      ctx,
      recipients: [
        {
          id: comment.authorId,
          type: "author",
        },
      ],
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

    const loggedUser = await getLoggedUser(ctx);
    if (!loggedUser) throw new Error("Unauthorized. You are not logged in.");

    const existingLike = await ctx.db
      .query("commentLikes")
      .withIndex("by_likerId_commentId", (q) =>
        q.eq("likerId", loggedUser.id).eq("commentId", args.commentId)
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
