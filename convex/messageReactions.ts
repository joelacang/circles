import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getLoggedUser, getUser, getUserPreview } from "./helpers/users";
import { paginationOptsValidator } from "convex/server";
import { MessageReact } from "@/features/chats/types";

export const reactMessage = mutation({
  args: {
    messageId: v.id("messages"),
    emojiCode: v.string(),
    emojiNative: v.string(),
  },
  handler: async (ctx, args) => {
    const loggedUser = await getLoggedUser(ctx);
    if (!loggedUser) throw new Error("Unauthorized. You are not logged in.");

    const { messageId, emojiCode, emojiNative } = args;
    const existing = await ctx.db
      .query("messageReactions")
      .withIndex("by_messageId_reactorId", (q) =>
        q.eq("messageId", messageId).eq("reactorId", loggedUser.id)
      )
      .unique();

    if (existing) {
      await ctx.db.delete(existing._id);
    }

    const reactionId = await ctx.db.insert("messageReactions", {
      messageId,
      reactorId: loggedUser.id,
      emojiNative,
      emojiCode,
    });

    return reactionId;
  },
});

export const getAllEmojiReactions = query({
  args: {
    messageId: v.id("messages"),
    emojiCode: v.string(),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const loggedUser = await getLoggedUser(ctx);

    const { messageId, emojiCode, paginationOpts } = args;
    const results = await ctx.db
      .query("messageReactions")
      .withIndex("by_messageId_emojiCode", (q) =>
        q.eq("messageId", messageId).eq("emojiCode", emojiCode)
      )
      .order("desc")
      .paginate(paginationOpts);

    const loggedUserData = results.page.find(
      (p) => p.reactorId === loggedUser?.id
    );

    let updatedReactors: MessageReact[] = [];

    if (loggedUser && loggedUserData) {
      const { _id, _creationTime, emojiCode, emojiNative } = loggedUserData;
      updatedReactors = [
        {
          id: _id,
          reactor: loggedUser,
          dateReacted: _creationTime,
          emojiCode,
          emojiNative,
        },
      ];
    }

    updatedReactors = (
      await Promise.all(
        results.page.map(async (data) => {
          const { _id, _creationTime, reactorId, emojiCode, emojiNative } =
            data;
          const reactor = await getUser({ ctx, userId: reactorId });

          if (!reactor) return null;

          return {
            id: _id,
            dateReacted: _creationTime,
            reactor,
            emojiCode,
            emojiNative,
          } satisfies MessageReact;
        })
      )
    ).filter((r) => r !== null);

    return {
      ...results,
      page: updatedReactors,
    };
  },
});

export const removeReaction = mutation({
  args: {
    reactionId: v.id("messageReactions"),
  },
  handler: async (ctx, args) => {
    const loggedUser = await getLoggedUser(ctx);
    if (!loggedUser) throw new Error("You are not logged in.");

    const { reactionId } = args;

    const reaction = await ctx.db.get(reactionId);

    if (!reaction) throw new Error("Reaction Data not found.");

    if (reaction.reactorId !== loggedUser.id)
      throw new Error("You are not allowed to remove this reaction");

    await ctx.db.delete(reactionId);

    return { success: true };
  },
});
