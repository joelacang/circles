import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getLoggedUser } from "./helpers/users";
import {
  createCustomChat,
  createDirectChat,
  getChatCode,
} from "./helpers/chats";
import { sendMessage } from "./helpers/messages";
import { Id } from "./_generated/dataModel";
import { paginationOptsValidator } from "convex/server";
import { getParticipantData } from "./helpers/chatParticipants";
import { Message } from "@/features/chats/types";
import { getAllMessageReactCounts } from "./helpers/messageReactions";

export const sendCustomMessage = mutation({
  args: {
    recipientIds: v.array(v.id("users")),
    body: v.string(),
  },
  handler: async (ctx, args) => {
    const loggedUser = await getLoggedUser(ctx);
    if (!loggedUser) throw new Error("Unauthorized. You are not logged in.");

    const { recipientIds, body } = args;

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
        const { _id, _creationTime, authorId, ...others } = msg;

        const reacts = await getAllMessageReactCounts({
          ctx,
          messageId: msg._id,
        });

        return {
          ...others,
          id: _id,
          authorId: authorId ?? null,
          dateCreated: _creationTime,
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
  },
  handler: async (ctx, args) => {
    const loggedUser = await getLoggedUser(ctx);
    if (!loggedUser) throw new Error("Unauthorized. You are not logged in.");

    const { chatId, body, parentMessageId } = args;

    const participantData = await getParticipantData({
      ctx,
      userId: loggedUser.id,
      chatId,
    });

    if (!participantData)
      throw new Error("You are not a participant of this chat.");

    const messageId = await sendMessage({ ctx, chatId, body, parentMessageId });

    return messageId;
  },
});
