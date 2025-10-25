import { Audience } from "@/types/enum";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  profiles: defineTable({
    clerkId: v.string(),
    dateOfBirth: v.number(),
    website: v.optional(v.string()),
    bio: v.optional(v.string()),
    isPrivate: v.boolean(),
  }).index("by_clerkId", ["clerkId"]),
  posts: defineTable({
    body: v.string(),
    authorId: v.string(),
    quotedPostId: v.optional(v.id("posts")),
    attachments: v.optional(v.array(v.id("_storage"))),
    //groupId: v.optional(v.id("groups")),
    likes: v.number(),
    comments: v.number(),
    bookmarks: v.number(),
    quotes: v.number(),
    audience: Audience,
  })
    .index("by_authorId", ["authorId"])
    .index("by_quotedPostId", ["quotedPostId"]),
  //.index("by_groupId", ["groupId"])
  //.index("by_groupId_authorId", ["groupId", "authorId"]),
  comments: defineTable({
    body: v.string(),
    authorId: v.string(),
    postId: v.id("posts"),
    parentCommentId: v.union(v.id("comments"), v.null()),
    likes: v.number(),
    comments: v.number(),
  })
    .index("by_postId", ["postId"])
    .index("by_authorId", ["authorId"])
    .index("by_postId_parentCommentId_likes", [
      "postId",
      "parentCommentId",
      "likes",
    ])
    .index("by_postId_parentCommentId_comments", [
      "postId",
      "parentCommentId",
      "comments",
    ])
    .index("by_postId_parentCommentId", ["postId", "parentCommentId"]),
  likes: defineTable({
    postId: v.id("posts"),
    likerId: v.string(),
  })
    .index("by_likerId_postId", ["likerId", "postId"])
    .index("by_likerId", ["likerId"])
    .index("by_postId", ["postId"]),
  folders: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    audience: Audience,
    ownerId: v.string(),
  })
    .index("by_ownerId", ["ownerId"])
    .index("by_ownerId_audience", ["ownerId", "audience"]),
  bookmarks: defineTable({
    postId: v.id("posts"),
    bookmarkerId: v.string(),
    folderId: v.optional(v.id("folders")),
  })
    .index("by_postId_bookmarkerId", ["postId", "bookmarkerId"])
    .index("by_postId", ["postId"])
    .index("by_bookmarkerId", ["bookmarkerId"])
    .index("by_folderId", ["folderId"]),
});
