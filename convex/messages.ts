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
import { getAllChatParticipants } from "./helpers/chatParticipants";
import { Message } from "@/features/chats/types";

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

    const allParticipants = await getAllChatParticipants({
      ctx,
      chatId: args.chatId,
    });

    const participantMap = new Map(allParticipants.map((p) => [p.id, p]));

    const isLoggedUserParticipant = participantMap.get(loggedUser.id);

    if (!isLoggedUserParticipant)
      throw new Error("You are not a participant of this chat.");

    const results = await ctx.db
      .query("messages")
      .withIndex("by_chatId_lastUpdateTime", (q) => q.eq("chatId", args.chatId))
      .order("desc")
      .paginate(args.paginationOpts);

    const messages: Message[] = results.page.map((msg) => {
      const { _id, _creationTime, authorId, ...others } = msg;

      const author = authorId ? participantMap.get(authorId) : null;

      return {
        ...others,
        id: _id,
        author: author ?? null,
        dateCreated: _creationTime,
      } satisfies Message;
    });

    return {
      ...results,
      page: messages,
    };
  },
});
