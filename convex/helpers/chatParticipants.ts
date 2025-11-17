import { Query } from "convex/server";
import { Doc, Id } from "../_generated/dataModel";
import { QueryCtx } from "../_generated/server";
import { UserPreview } from "@/features/users/types";
import { getUser } from "./users";

export async function getParticipantData({
  ctx,
  userId,
  chatId,
}: {
  ctx: QueryCtx;
  userId: Id<"users">;
  chatId: Id<"chats">;
}): Promise<Doc<"chatParticipants"> | null> {
  return await ctx.db
    .query("chatParticipants")
    .withIndex("by_chatId_participantId", (q) =>
      q.eq("chatId", chatId).eq("participantId", userId)
    )
    .unique();
}

export async function getAllChatParticipants({
  ctx,
  chatId,
}: {
  ctx: QueryCtx;
  chatId: Id<"chats">;
}): Promise<UserPreview[]> {
  const results = await ctx.db
    .query("chatParticipants")
    .withIndex("by_chatId", (q) => q.eq("chatId", chatId))
    .collect();

  const users = (
    await Promise.all(
      results.map(async (u) => await getUser({ ctx, userId: u.participantId }))
    )
  ).filter((u) => u !== null);

  return users;
}
