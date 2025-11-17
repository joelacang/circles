import { paginationOptsValidator } from "convex/server";
import { query } from "./_generated/server";
import { getLoggedUser } from "./helpers/users";
import { getChatDetail } from "./helpers/chats";
import { ChatDetail } from "@/features/chats/types";

export const getAllChatParticipation = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    const loggedUser = await getLoggedUser(ctx);
    if (!loggedUser) throw new Error("Unauthorized. You are not logged in.");

    const results = await ctx.db
      .query("chatParticipants")
      .withIndex("by_participantId_lastReadTime", (q) =>
        q.eq("participantId", loggedUser.id)
      )
      .order("desc")
      .paginate(args.paginationOpts);

    const chats: ChatDetail[] = (
      await Promise.all(
        results.page.map(async (participation) => {
          const chatDetail = await getChatDetail({
            ctx,
            chatId: participation.chatId,
          });

          return chatDetail;
        })
      )
    ).filter((c) => c !== null);

    const sortedChats = [...chats].sort(
      (a, b) =>
        (b.chat.latestMessageTime ?? 0) - (a.chat.latestMessageTime ?? 0)
    );

    return {
      ...results,
      page: sortedChats,
    };
  },
});
