import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { paginationOptsValidator } from "convex/server";

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

    let validParentId = args.parentCommentId;
    let parentComment = null;

    if (args.parentCommentId) {
      parentComment = await ctx.db.get(args.parentCommentId);
      if (!parentComment) {
        // Silently convert to top-level comment
        validParentId = null;
      }
    }

    //Create the comment
    const commentId = await ctx.db.insert("comments", {
      body: args.body,
      parentCommentId: validParentId,
      postId: args.postId,
      authorId: userIdentity.subject,
      likes: 0,
      comments: 0,
    });

    //Update Parent Comment Counter
    if (parentComment) {
      await ctx.db.patch(args.parentCommentId!, {
        comments: (parentComment.comments ?? 0) + 1,
      });
    }

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
    order: v.union(
      v.literal("recent"),
      v.literal("popular"),
      v.literal("commented")
    ),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    // Build query based on sort order
    const buildQuery = () => {
      switch (args.order) {
        case "popular":
          return ctx.db
            .query("comments")
            .withIndex("by_postId_parentCommentId_likes", (q) =>
              q.eq("postId", args.postId).eq("parentCommentId", null)
            )
            .order("desc");

        case "commented":
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

    const commentsData = await buildQuery().paginate(args.paginationOpts);
  },
});
