import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const bookmarkPost = mutation({
  args: {
    postId: v.id("posts"),
    folderId: v.optional(v.id("folders")),
  },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.postId);
    if (!post) throw new Error("Post Not Found.");

    const userIdentity = await ctx.auth.getUserIdentity();
    if (!userIdentity) throw new Error("Unauthorized. You are not logged in.");

    const existingBookmark = await ctx.db
      .query("bookmarks")
      .withIndex("by_postId_bookmarkerId", (q) =>
        q.eq("postId", args.postId).eq("bookmarkerId", userIdentity.subject)
      )
      .unique();

    if (existingBookmark) throw new Error("You already bookmarked this post.");

    const bookmarkId = await ctx.db.insert("bookmarks", {
      postId: args.postId,
      bookmarkerId: userIdentity.subject,
      folderId: args.folderId,
    });

    await ctx.db.patch(args.postId, {
      bookmarks: post.bookmarks + 1,
    });

    return bookmarkId;
  },
});

export const unbookmarkPost = mutation({
  args: {
    postId: v.id("posts"),
  },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.postId);
    if (!post) throw new Error("Post Not Found.");

    const userIdentity = await ctx.auth.getUserIdentity();
    if (!userIdentity) throw new Error("Unauthorized. You are not logged in.");

    const existingBookmark = await ctx.db
      .query("bookmarks")
      .withIndex("by_postId_bookmarkerId", (q) =>
        q.eq("postId", args.postId).eq("bookmarkerId", userIdentity.subject)
      )
      .unique();

    if (!existingBookmark)
      throw new Error("You have not bookmarked this post.");

    await ctx.db.delete(existingBookmark._id);

    await ctx.db.patch(args.postId, {
      bookmarks: Math.max((post.bookmarks ?? 0) - 1, 0),
    });

    return { success: true };
  },
});
