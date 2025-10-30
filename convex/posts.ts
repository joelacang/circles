import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { AUDIENCE, Audience } from "@/types/enum";
import { paginationOptsValidator } from "convex/server";
import { Post } from "@/features/posts/types";
import { getPostData, getPostStatus } from "./helpers/posts";
import { updateStats } from "./helpers/stats";

export const create = mutation({
  args: {
    body: v.string(),
    quotedPostId: v.optional(v.id("posts")),
    groupId: v.optional(v.id("groups")),
    attachments: v.array(v.id("_storage")),
    audience: Audience,
  },
  handler: async (ctx, args) => {
    const userIdentity = await ctx.auth.getUserIdentity();

    if (!userIdentity) throw new Error("Unauthorized. Not logged in.");

    const loggedUserId = userIdentity.subject;

    const postId = await ctx.db.insert("posts", {
      body: args.body,
      authorId: loggedUserId,
      quotedPostId: args.quotedPostId,
      attachments: args.attachments,
      likes: 0,
      comments: 0,
      quotes: 0,
      bookmarks: 0,
      audience: args.audience,
    });

    await updateStats({
      ctx,
      clerkId: loggedUserId,
      mode: "add",
      field: "posts",
    });

    return { postId };
  },
});

export const getUserPosts = query({
  args: {
    userId: v.string(),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const results = await ctx.db
      .query("posts")
      .withIndex("by_authorId", (q) => q.eq("authorId", args.userId))
      .order("desc")
      .paginate(args.paginationOpts);

    const posts: Post[] = await Promise.all(
      results.page.map(async (post) => await getPostData(ctx, post))
    );

    return {
      ...results,
      page: posts,
    };
  },
});

export const getPostDetail = query({
  args: {
    postId: v.string(),
  },
  handler: async (ctx, args) => {
    const postId = ctx.db.normalizeId("posts", args.postId);

    if (!postId) return { success: false, error: "Post Not Found." };

    const result = await ctx.db.get(postId);

    if (!result) return { success: false, error: "Post Not Found." };

    const post = await getPostData(ctx, result);

    return { success: true, data: post };
  },
});
