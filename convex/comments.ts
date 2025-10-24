import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const create = mutation({
  args: {
    body: v.string(),
    parentCommentId: v.optional(v.id("comments")),
    postId: v.id("posts"),
  },
  handler: async (ctx, args) => {
    const userIdentity = await ctx.auth.getUserIdentity();
    if (!userIdentity) throw new Error("Unauthorized. You are not logged in.");

    const loggedUserId = userIdentity.subject;

    const commentId = ctx.db.insert("comments", {
      body: args.body,
      parentCommentId: args.parentCommentId,
      postId: args.postId,
      authorId: loggedUserId,
      likes: 0,
    });

    return commentId;
  },
});
