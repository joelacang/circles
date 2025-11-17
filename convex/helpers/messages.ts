import { Id } from "../_generated/dataModel";
import { MutationCtx } from "../_generated/server";
import { getLoggedUser } from "./users";

export async function sendMessage({
  ctx,
  chatId,
  body,
  parentMessageId,
}: {
  ctx: MutationCtx;
  chatId: Id<"chats">;
  body: string;
  parentMessageId?: Id<"messages">;
}): Promise<Id<"messages">> {
  const loggedUser = await getLoggedUser(ctx);
  if (!loggedUser) throw new Error("Unauthorized. You are not logged in.");

  const messageId = await ctx.db.insert("messages", {
    chatId,
    body,
    authorId: loggedUser.id,
    parentMessageId,
  });

  //Update latestMessage in Chat
  await ctx.db.patch(chatId, {
    latestMessage: body,
    latestMessageSenderId: loggedUser.id,
    latestMessageTime: Date.now(),
  });

  //Update unread counts on all participants
  const participants = await ctx.db
    .query("chatParticipants")
    .withIndex("by_chatId", (q) => q.eq("chatId", chatId))
    .filter((q) => q.neq(q.field("participantId"), loggedUser.id))
    .collect();

  await Promise.all(
    participants.map((p) =>
      ctx.db.patch(p._id, { unreadMessages: p.unreadMessages + 1 })
    )
  );

  return messageId;
}
