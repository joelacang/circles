import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getLoggedUser } from "./helpers/users";
import {
  createCustomChat,
  createDirectChat,
  getChatCode,
} from "./helpers/chats";
import { getMessage, sendMessage } from "./helpers/messages";
import { Id } from "./_generated/dataModel";
import { paginationOptsValidator } from "convex/server";
import { getParticipantData } from "./helpers/chatParticipants";
import { Message } from "@/features/chats/types";
import { getAllMessageReactCounts } from "./helpers/messageReactions";

export const sendCustomMessage = mutation({
  args: {
    recipientIds: v.array(v.id("users")),
    body: v.string(),
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
  },
  handler: async (ctx, args) => {
    const loggedUser = await getLoggedUser(ctx);
    if (!loggedUser) throw new Error("Unauthorized. You are not logged in.");

    const { recipientIds, body, attachments } = args;

    //sort recipients, check duplicates
    const allSortedParticipants = Array.from(
      new Set([...recipientIds, loggedUser.id])
    ).sort();

    //verify chat type and generate chatCode
    const chatType = allSortedParticipants.length > 2 ? "custom" : "direct";
    const tempCode = getChatCode(allSortedParticipants, chatType);

    // Check if chat already exists
    const existingChat = await ctx.db
      .query("chats")
      .withIndex("by_code", (q) => q.eq("code", tempCode))
      .unique();

    let chatId: Id<"chats"> | null = null;

    if (existingChat) {
      chatId = existingChat._id;
    } else {
      // Create new chat
      if (chatType === "custom") {
        chatId = await createCustomChat({
          ctx,
          participantIds: allSortedParticipants,
        });
      } else {
        const otherParticipantId = allSortedParticipants.find(
          (id) => id !== loggedUser.id
        );
        if (!otherParticipantId) throw new Error("Invalid participant Id");

        chatId = await createDirectChat({ ctx, otherParticipantId });
      }
    }

    if (!chatId) throw new Error("Error creating chat.");

    // Send message
    const messageId = await sendMessage({
      ctx,
      chatId,
      body,
    });

    if (messageId && attachments.length > 0) {
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

          await ctx.db.insert("messageAttachments", {
            messageId,
            attachmentId,
            uploaderId: loggedUser.id,
          });
        })
      );
    }

    return messageId;
  },
});

export const getChatMessages = query({
  args: { chatId: v.id("chats"), paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    const loggedUser = await getLoggedUser(ctx);
    if (!loggedUser) throw new Error("Unauthorized. You are not logged in.");

    const isLoggedUserParticipant = await getParticipantData({
      ctx,
      userId: loggedUser.id,
      chatId: args.chatId,
    });

    if (!isLoggedUserParticipant)
      throw new Error("You are not a participant of this chat.");

    const results = await ctx.db
      .query("messages")
      .withIndex("by_chatId_lastUpdateTime", (q) => q.eq("chatId", args.chatId))
      .order("desc")
      .paginate(args.paginationOpts);

    const messages: Message[] = await Promise.all(
      results.page.map(async (msg) => {
        const { _id, _creationTime, authorId, deletionTime, ...others } = msg;

        const reacts = await getAllMessageReactCounts({
          ctx,
          messageId: msg._id,
        });

        return {
          ...others,
          id: _id,
          authorId,
          dateCreated: _creationTime,
          dateDeleted: deletionTime,
          reacts,
        } satisfies Message;
      })
    );

    return {
      ...results,
      page: messages,
    };
  },
});

export const sendChatMessage = mutation({
  args: {
    chatId: v.id("chats"),
    body: v.string(),
    parentMessageId: v.optional(v.id("messages")),
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
  },
  handler: async (ctx, args) => {
    const loggedUser = await getLoggedUser(ctx);
    if (!loggedUser) throw new Error("Unauthorized. You are not logged in.");

    const { chatId, body, parentMessageId, attachments } = args;

    const participantData = await getParticipantData({
      ctx,
      userId: loggedUser.id,
      chatId,
    });

    if (!participantData)
      throw new Error("You are not a participant of this chat.");

    const messageId = await sendMessage({ ctx, chatId, body, parentMessageId });

    if (messageId && attachments.length > 0) {
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

          await ctx.db.insert("messageAttachments", {
            messageId,
            attachmentId,
            uploaderId: loggedUser.id,
          });
        })
      );
    }

    return messageId;
  },
});

export const getMessageByID = query({
  args: { messageId: v.id("messages") },
  handler: async (ctx, args) => {
    return await getMessage({ ctx, messageId: args.messageId });
  },
});

export const deleteMessageById = mutation({
  args: { messageId: v.id("messages") },
  handler: async (ctx, args) => {
    const loggedUser = await getLoggedUser(ctx);
    if (!loggedUser) throw new Error("Unauthorized. You are not logged in.");

    const message = await ctx.db.get(args.messageId);

    if (message?._id !== args.messageId) throw new Error("Invalid message Id.");

    if (message.authorId !== loggedUser.id)
      throw new Error("You are not allowed to delete this message.");

    await ctx.db.patch(message._id, {
      deletionTime: Date.now(),
    });

    return { success: true };
  },
});

export const getUnreadMessagesCount = query({
  args: {},
  handler: async (ctx, args) => {
    const loggedUser = await getLoggedUser(ctx);
    if (!loggedUser) throw new Error("Unauthorized. You are not logged in.");

    const chatsParticipated = await ctx.db
      .query("chatParticipants")
      .withIndex("by_participantId_lastReadTime", (q) =>
        q.eq("participantId", loggedUser.id)
      )
      .collect();

    const unreadCount = chatsParticipated.reduce(
      (a, { unreadMessages: b }) => a + b,
      0
    );

    return unreadCount;
  },
});
