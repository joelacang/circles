import { convexToJson, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getLoggedUser } from "./helpers/users";
import { Id } from "./_generated/dataModel";
import { createDirectChat, getChatCode, getChatDetail } from "./helpers/chats";
import { getParticipantData } from "./helpers/chatParticipants";

export const getDirectChat = mutation({
  args: {
    participantId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const loggedUser = await getLoggedUser(ctx);
    if (!loggedUser) throw new Error("Unauthorized. You are not logged in.");

    const code = getChatCode([args.participantId, loggedUser.id], "direct");

    const existingChat = await ctx.db
      .query("chats")
      .withIndex("by_code", (q) => q.eq("code", code))
      .first();

    const chatId = existingChat
      ? existingChat._id
      : await createDirectChat({ ctx, otherParticipantId: args.participantId });

    const chatDetail = await getChatDetail({ ctx, chatId });

    return chatDetail;
  },
});

export const getChat = query({
  args: {
    chatId: v.id("chats"),
  },
  handler: async (ctx, args) => {
    const loggedUser = await getLoggedUser(ctx);
    if (!loggedUser) throw new Error("Unauthorized. You are not logged in.");

    const { chatId } = args;

    const participant = await getParticipantData({
      ctx,
      userId: loggedUser.id,
      chatId,
    });

    //update unread count
    if (!participant)
      throw new Error("You are not a participant of this chat.");

    const chatDetail = await getChatDetail({ ctx, chatId });

    return chatDetail;
  },
});

export const readChat = mutation({
  args: { chatId: v.id("chats") },
  handler: async (ctx, args) => {
    const loggedUser = await getLoggedUser(ctx);
    if (!loggedUser) throw new Error("Unauthorized. You are not logged in.");

    const participant = await getParticipantData({
      ctx,
      userId: loggedUser.id,
      chatId: args.chatId,
    });

    if (!participant)
      throw new Error("You are not a participant of this chat.");

    await ctx.db.patch(participant._id, {
      unreadMessages: 0,
      lastReadTime: Date.now(),
    });

    return participant._id;
  },
});
