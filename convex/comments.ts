import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { paginationOptsValidator } from "convex/server";
import { Order } from "@/types/enum";
import { Comment } from "@/features/comments/types";
import { getCommentStatus } from "./helpers/comments";
import { addNotification } from "./helpers/notifications";

export const create = mutation({
  args: {
    body: v.string(),
    parentCommentId: v.union(v.id("comments"), v.null()),
    postId: v.id("posts"),
  },
  handler: async (ctx, args) => {
    const userIdentity = await ctx.auth.getUserIdentity();
    if (!userIdentity) throw new Error("Unauthorized");

    const post = await ctx.db.get(args.postId);
    if (!post) throw new Error("Post not found");

    //Create the comment
    const commentId = await ctx.db.insert("comments", {
      body: args.body,
      parentCommentId: args.parentCommentId,
      postId: args.postId,
      authorId: userIdentity.subject,
      likes: 0,
      comments: 0,
    });

    //Update Parent Comment Counter
    if (args.parentCommentId) {
      const parentComment = await ctx.db.get(args.parentCommentId);

      if (!parentComment) return;

      await ctx.db.patch(args.parentCommentId, {
        comments: (parentComment.comments ?? 0) + 1,
      });

      await addNotification({
        ctx,
        recipientId: parentComment.authorId,
        source: {
          action: "comment",
          commentId: parentComment._id,
        },
      });
    }

    await addNotification({
      ctx,
      recipientId: post.authorId,
      source: {
        action: "comment",
        postId: post._id,
      },
    });

    //Update Post Comment Counter
    await ctx.db.patch(args.postId, {
      comments: (post.comments ?? 0) + 1,
    });

    return commentId;
  },
});

export const getTopLevelComments = query({
  args: {
    postId: v.id("posts"),
    order: Order,
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    // Build query based on sort order
    const buildQuery = () => {
      switch (args.order) {
        case "Most Likes":
          return ctx.db
            .query("comments")
            .withIndex("by_postId_parentCommentId_likes", (q) =>
              q.eq("postId", args.postId).eq("parentCommentId", null)
            )
            .order("desc");

        case "Most Commented":
          return ctx.db
            .query("comments")
            .withIndex("by_postId_parentCommentId_comments", (q) =>
              q.eq("postId", args.postId).eq("parentCommentId", null)
            )
            .order("desc");

        default: // "recent" or fallback
          return ctx.db
            .query("comments")
            .withIndex("by_postId_parentCommentId", (q) =>
              q.eq("postId", args.postId).eq("parentCommentId", null)
            )
            .order("desc");
      }
    };

    const results = await buildQuery().paginate(args.paginationOpts);

    const page: Comment[] = await Promise.all(
      results.page.map(async (comment) => {
        const { isLiked } = await getCommentStatus(ctx, comment._id);

        return {
          ...comment,
          id: comment._id,
          dateCreated: comment._creationTime,
          isLiked: isLiked,
        };
      })
    );

    return {
      ...results,
      page,
    };
  },
});

export const getReplies = query({
  args: {
    parentCommentId: v.id("comments"),
    postId: v.id("posts"),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const results = await ctx.db
      .query("comments")
      .withIndex("by_postId_parentCommentId", (q) =>
        q.eq("postId", args.postId).eq("parentCommentId", args.parentCommentId)
      )
      .order("desc")
      .paginate(args.paginationOpts);

    const page: Comment[] = await Promise.all(
      results.page.map(async (comment) => {
        const { isLiked } = await getCommentStatus(ctx, comment._id);

        return {
          ...comment,
          id: comment._id,
          dateCreated: comment._creationTime,
          isLiked: isLiked,
        };
      })
    );

    return {
      ...results,
      page,
    };
  },
});
