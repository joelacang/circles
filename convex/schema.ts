import { Audience } from "@/types/enum";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    name: v.string(),
    username: v.string(),
    imageUrl: v.optional(v.string()),
    email: v.string(),
  })
    .index("by_clerkId", ["clerkId"])
    .index("by_email", ["email"])
    .index("by_username", ["username"])
    .searchIndex("search_name", {
      searchField: "name",
      filterFields: ["username", "email"],
    })
    .searchIndex("search_username", {
      searchField: "username",
    })
    .searchIndex("search_email", {
      searchField: "email",
    }),
  profiles: defineTable({
    userId: v.id("users"),
    dateOfBirth: v.number(),
    website: v.optional(v.string()),
    bio: v.optional(v.string()),
    isPrivate: v.boolean(),
  }).index("by_userId", ["userId"]),
  stats: defineTable({
    userId: v.id("users"),
    followers: v.number(),
    following: v.number(),
    posts: v.number(),
    unreadNotifs: v.number(),
  }).index("by_userId", ["userId"]),
  follows: defineTable({
    followedUserId: v.id("users"),
    followedByUserId: v.id("users"),
  })
    .index("by_followedUserId", ["followedUserId"])
    .index("by_followedByUserId", ["followedByUserId"])
    .index("by_followedUserId_followedByUserId", [
      "followedUserId",
      "followedByUserId",
    ]),
  posts: defineTable({
    body: v.string(),
    authorId: v.id("users"),
    quotedPostId: v.optional(v.id("posts")),
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
  postAttachments: defineTable({
    postId: v.id("posts"),
    uploaderId: v.id("users"),
    attachmentId: v.id("attachments"),
  })
    .index("by_postId", ["postId"])
    .index("by_attachmentId", ["attachmentId"])
    .index("by_uploaderId", ["uploaderId"]),
  postTags: defineTable({
    postId: v.id("posts"),
    taggedUserId: v.id("users"),
    taggedByUserId: v.id("users"),
  })
    .index("by_postId", ["postId"])
    .index("by_taggedUserId", ["taggedUserId"])
    .index("by_taggedByUserId", ["taggedByUserId"]),
  postMentions: defineTable({
    postId: v.id("posts"),
    mentionedUserId: v.id("users"),
    mentionedByUserId: v.id("users"),
  })
    .index("by_postId", ["postId"])
    .index("by_mentionedUserId", ["mentionedUserId"])
    .index("by_mentionedByUserId", ["mentionedByUserId"]),
  comments: defineTable({
    body: v.string(),
    authorId: v.id("users"),
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
  commentMentions: defineTable({
    commentId: v.id("comments"),
    mentionedUserId: v.id("users"),
    mentionedByUserId: v.id("users"),
  })
    .index("by_commentId", ["commentId"])
    .index("by_mentionedUserId", ["mentionedUserId"])
    .index("by_commentId_mentionedUserId", ["commentId", "mentionedUserId"]),
  likes: defineTable({
    postId: v.id("posts"),
    likerId: v.id("users"),
  })
    .index("by_likerId_postId", ["likerId", "postId"])
    .index("by_likerId", ["likerId"])
    .index("by_postId", ["postId"]),
  commentLikes: defineTable({
    commentId: v.id("comments"),
    likerId: v.id("users"),
  })
    .index("by_likerId_commentId", ["likerId", "commentId"])
    .index("by_likerId", ["likerId"])
    .index("by_commentId", ["commentId"]),
  folders: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    audience: Audience,
    ownerId: v.id("users"),
  })
    .index("by_ownerId", ["ownerId"])
    .index("by_ownerId_audience", ["ownerId", "audience"]),
  bookmarks: defineTable({
    postId: v.id("posts"),
    bookmarkerId: v.id("users"),
    folderId: v.optional(v.id("folders")),
  })
    .index("by_postId_bookmarkerId", ["postId", "bookmarkerId"])
    .index("by_postId", ["postId"])
    .index("by_bookmarkerId", ["bookmarkerId"])
    .index("by_folderId", ["folderId"]),
  notifications: defineTable({
    groupDate: v.string(),
    source: v.union(
      v.object({
        action: v.literal("follow"),
        followedUserId: v.id("users"),
      }),
      v.object({
        action: v.literal("like"),
        postId: v.id("posts"),
      }),
      v.object({
        action: v.literal("like"),
        commentId: v.id("comments"),
      }),
      v.object({
        action: v.literal("comment"),
        postId: v.id("posts"),
      }),
      v.object({
        action: v.literal("reply"),
        commentId: v.id("comments"),
      }),
      v.object({
        action: v.literal("mention"),
        commentId: v.id("comments"),
      }),
      v.object({
        action: v.literal("mention"),
        postId: v.id("posts"),
      }),
      v.object({
        action: v.literal("quote"),
        postId: v.id("posts"),
      })
    ),
    preview: v.optional(v.string()),
    updateTime: v.number(),
  })
    .index("by_action_groupDate", ["source.action", "groupDate"])
    .index("by_action_postId_date", [
      "source.action",
      "source.postId",
      "groupDate",
    ])
    .index("by_action_commentId_date", [
      "source.action",
      "source.commentId",
      "groupDate",
    ])
    .index("by_action_userId_groupDate", [
      "source.action",
      "source.followedUserId",
      "groupDate",
    ]),
  notificationRecipients: defineTable({
    notificationId: v.id("notifications"),
    recipientId: v.id("users"),
    type: v.union(
      v.literal("author"),
      v.literal("tag"),
      v.literal("mention"),
      v.literal("follow")
    ),
    readTime: v.optional(v.number()),
    updateTime: v.number(),
  })
    .index("by_notificationId", ["notificationId"])
    .index("by_recipientId_lastUpdateTime", ["recipientId", "updateTime"])
    .index("by_notificationId_type", ["notificationId", "type"])
    .index("by_recipientId_readTime", ["recipientId", "readTime"])
    .index("by_notificationId_recipientId", ["notificationId", "recipientId"]),
  notificationSenders: defineTable({
    notificationId: v.id("notifications"),
    senderId: v.id("users"),
  })
    .index("by_notificationId", ["notificationId"])
    .index("by_senderId", ["senderId"])
    .index("by_notificationId_senderId", ["notificationId", "senderId"]),
  chats: defineTable({
    name: v.optional(v.string()),
    code: v.string(),
    description: v.optional(v.string()),
    type: v.union(v.literal("direct"), v.literal("group"), v.literal("custom")),
    creatorId: v.id("users"),
    latestMessageTime: v.optional(v.number()),
    latestMessage: v.optional(v.string()),
    latestMessageSenderId: v.optional(v.id("users")),
    participantsCount: v.number(),
  })
    .searchIndex("by_name", {
      searchField: "name",
    })
    .index("by_code", ["code"]),
  chatParticipants: defineTable({
    chatId: v.id("chats"),
    participantId: v.id("users"),
    lastReadTime: v.optional(v.number()),
    role: v.optional(v.union(v.literal("member"), v.literal("admin"))),
    typingTime: v.optional(v.number()),
    unreadMessages: v.number(),
  })
    .index("by_chatId", ["chatId"])
    .index("by_participantId_lastReadTime", ["participantId", "lastReadTime"])
    .index("by_chatId_participantId", ["chatId", "participantId"]),
  messages: defineTable({
    chatId: v.id("chats"),
    authorId: v.optional(v.id("users")),
    body: v.string(),
    lastUpdateTime: v.optional(v.number()),
    parentMessageId: v.optional(v.id("messages")),
    forwardedMessageId: v.optional(v.id("messages")),
    deletionTime: v.optional(v.number()),
  })
    .index("by_chatId_lastUpdateTime", ["chatId", "lastUpdateTime"])
    .searchIndex("search_body", { searchField: "body" }),
  messageAttachments: defineTable({
    messageId: v.id("messages"),
    uploaderId: v.id("users"),
    attachmentId: v.id("attachments"),
  })
    .index("by_messageId", ["messageId"])
    .index("by_attachmentId", ["attachmentId"])
    .index("by_uploaderId", ["uploaderId"]),
  messageDrafts: defineTable({
    authorId: v.id("users"),
    body: v.string(),
    attachments: v.optional(v.array(v.id("_storage"))),
    lastUpdateTime: v.optional(v.number()),
  })
    .index("by_authorId_lastUpdateTime", ["authorId", "lastUpdateTime"])
    .searchIndex("search_body", { searchField: "body" }),
  messageReactions: defineTable({
    messageId: v.id("messages"),
    reactorId: v.id("users"),
    emojiNative: v.string(),
    emojiCode: v.string(),
  })
    .index("by_messageId", ["messageId"])
    .index("by_messageId_reactorId_emojiCode", [
      "messageId",
      "reactorId",
      "emojiCode",
    ])
    .index("by_messageId_reactorId", ["messageId", "reactorId"])
    .index("by_messageId_emojiCode", ["messageId", "emojiCode"]),
  messageDraftRecipients: defineTable({
    messageDraftId: v.id("messageDrafts"),
    recipientId: v.id("users"),
  })
    .index("by_messageDraftId", ["messageDraftId"])
    .index("by_messageDraftId_recipientId", ["messageDraftId", "recipientId"]),
  attachments: defineTable({
    storageId: v.id("_storage"),
    type: v.optional(v.string()),
    height: v.optional(v.number()),
    width: v.optional(v.number()),
    size: v.optional(v.number()),
    uploaderId: v.id("users"),
  }).index("by_uploaderId", ["uploaderId"]),
});
