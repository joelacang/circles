import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Audience } from "@/types/enum";
import { paginationOptsValidator } from "convex/server";
import { Post } from "@/features/posts/types";
import { getPostData } from "./helpers/posts";
import { updateStats } from "./helpers/stats";
import { getLoggedUser } from "./helpers/users";

export const create = mutation({
  args: {
    body: v.string(),
    quotedPostId: v.optional(v.id("posts")),
    groupId: v.optional(v.id("groups")),
    attachments: v.array(
      v.object({
        storageId: v.id("_storage"),
        details: v.optional(
          v.object({
            width: v.optional(v.number()),
            height: v.optional(v.number()),
            size: v.optional(v.number()),
            type: v.optional(v.string()),
          })
        ),
      })
    ),
    audience: Audience,
  },
  handler: async (ctx, args) => {
    const loggedUser = await getLoggedUser(ctx);
    if (!loggedUser) throw new Error("Unauthorized. You are not logged in.");

    const { body, quotedPostId, groupId, attachments, audience } = args;
    const postId = await ctx.db.insert("posts", {
      body,
      authorId: loggedUser.id,
      quotedPostId,
      likes: 0,
      comments: 0,
      quotes: 0,
      bookmarks: 0,
      audience,
    });

    if (postId && attachments.length > 0) {
      await Promise.all(
        attachments.map(async (attachment) => {
          const { storageId, details } = attachment;

          const attachmentId = await ctx.db.insert("attachments", {
            storageId,
            uploaderId: loggedUser.id,
            height: details?.height,
            width: details?.width,
            size: details?.size,
            type: details?.type,
          });

          const id = await ctx.db.insert("postAttachments", {
            postId: postId,
            attachmentId,
            uploaderId: loggedUser.id,
          });

          console.log(`Saved to postAttachment Id: ${id}`);

          return id;
        })
      );
    }

    await updateStats({
      ctx,
      userId: loggedUser.id,
      mode: "add",
      field: "posts",
    });

    return { postId };
  },
});

export const getUserPosts = query({
  args: {
    userId: v.id("users"),
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
