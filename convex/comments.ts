import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { paginationOptsValidator } from "convex/server";
import { Order } from "@/types/enum";
import { Comment } from "@/features/comments/types";
import { getCommentStatus } from "./helpers/comments";
import {
  addCommentNotification,
  addNotification,
  addPostNotification,
} from "./helpers/notifications";
import { getLoggedUser, getUser } from "./helpers/users";

export const create = mutation({
  args: {
    body: v.string(),
    parentCommentId: v.union(v.id("comments"), v.null()),
    postId: v.id("posts"),
  },
  handler: async (ctx, args) => {
    const loggedUser = await getLoggedUser(ctx);
    if (!loggedUser) throw new Error("Unauthorized. You are not logged in.");

    const post = await ctx.db.get(args.postId);
    if (!post) throw new Error("Post not found");

    //Create the comment
    const commentId = await ctx.db.insert("comments", {
      body: args.body,
      parentCommentId: args.parentCommentId,
      postId: args.postId,
      authorId: loggedUser.id,
      likes: 0,
      comments: 0,
    });

    //Update Parent Comment Counter
    if (args.parentCommentId) {
      const parentComment = await ctx.db.get(args.parentCommentId);
      if (!parentComment) throw new Error("Comment not found.");

      await ctx.db.patch(args.parentCommentId, {
        comments: (parentComment.comments ?? 0) + 1,
      });

      if (parentComment.authorId !== post.authorId) {
        await addCommentNotification({
          ctx,
          source: {
            action: "reply",
            commentId: parentComment._id,
          },
          preview: args.body,
        });
      }
    }

    await addPostNotification({
      ctx,
      source: {
        action: "comment",
        postId: post._id,
      },
      preview: args.body,
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
    const loggedUser = await getLoggedUser(ctx);

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

    const page: Comment[] = (
      await Promise.all(
        results.page.map(async (comment) => {
          const {
            _id,
            body,
            authorId,
            likes,
            comments,
            postId,
            parentCommentId,
            _creationTime,
          } = comment;

          const { isLiked } = await getCommentStatus(ctx, _id);
          const author =
            authorId === loggedUser?.id
              ? loggedUser
              : await getUser({ ctx, userId: authorId });

          if (!author) return null;

          return {
            id: _id,
            body,
            author,
            likes,
            comments,
            postId,
            parentCommentId,
            dateCreated: _creationTime,
            isLiked,
          };
        })
      )
    ).filter((p) => p !== null);

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
    const loggedUser = await getLoggedUser(ctx);
    const results = await ctx.db
      .query("comments")
      .withIndex("by_postId_parentCommentId", (q) =>
        q.eq("postId", args.postId).eq("parentCommentId", args.parentCommentId)
      )
      .order("desc")
      .paginate(args.paginationOpts);

    const page: Comment[] = (
      await Promise.all(
        results.page.map(async (comment) => {
          const {
            _id,
            body,
            authorId,
            likes,
            comments,
            postId,
            parentCommentId,
            _creationTime,
          } = comment;

          const { isLiked } = await getCommentStatus(ctx, _id);
          const author =
            loggedUser?.id === authorId
              ? loggedUser
              : await getUser({ ctx, userId: authorId });

          if (!author) return null;

          return {
            id: _id,
            body,
            author,
            likes,
            comments,
            postId,
            parentCommentId,
            dateCreated: _creationTime,
            isLiked,
          };
        })
      )
    ).filter((p) => p !== null);

    return {
      ...results,
      page,
    };
  },
});
