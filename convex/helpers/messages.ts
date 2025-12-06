import { Message } from "@/features/chats/types";
import { Id } from "../_generated/dataModel";
import { MutationCtx, QueryCtx } from "../_generated/server";
import { getLoggedUser } from "./users";
import { getAllEmojiReactions } from "../messageReactions";
import { getAllMessageReactCounts } from "./messageReactions";

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

export async function getMessage({
  ctx,
  messageId,
}: {
  ctx: QueryCtx;
  messageId: Id<"messages">;
}) {
  const message = await ctx.db.get(messageId);

  if (!message) return null;

  const { _id, _creationTime, deletionTime, ...others } = message;

  const reacts = await getAllMessageReactCounts({ ctx, messageId });

  return {
    ...others,
    id: _id,
    dateCreated: _creationTime,
    dateDeleted: deletionTime,
    reacts,
  } satisfies Message;
}
