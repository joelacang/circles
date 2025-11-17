import { ChatDetail } from "@/features/chats/types";
import { Id } from "../_generated/dataModel";
import { MutationCtx, QueryCtx } from "../_generated/server";
import { getLoggedUser, getUser, getUserPreview } from "./users";

export async function getChatDetail({
  ctx,
  chatId,
}: {
  ctx: QueryCtx;
  chatId: Id<"chats">;
}): Promise<ChatDetail | null> {
  const loggedUser = await getLoggedUser(ctx);
  if (!loggedUser) return null;

  const chat = await ctx.db.get(chatId);
  if (!chat) return null;

  const { _id, _creationTime, participantsCount, ...others } = chat;

  const participants = await ctx.db
    .query("chatParticipants")
    .withIndex("by_chatId", (q) => q.eq("chatId", chatId))
    .collect();

  const loggedUserParticipationData = participants.find(
    (p) => p.participantId === loggedUser.id
  );

  if (!loggedUserParticipationData) return null;

  if (chat.type === "direct") {
    const otherParticipant = participants.find(
      (p) => p.participantId !== loggedUser.id
    );

    if (!otherParticipant) return null;

    const otherParticipantData = await ctx.db.get(
      otherParticipant.participantId
    );

    if (!otherParticipantData) return null;

    const otherParticipantPreview = getUserPreview(otherParticipantData);

    return {
      type: chat.type,
      chat: {
        id: _id,
        participantsCount: participantsCount,
        dateCreated: _creationTime,
        unreadCount: loggedUserParticipationData.unreadMessages,
        ...others,
      },
      participant: otherParticipantPreview,
    };
  }

  if (chat.type === "custom") {
    const participantsPreview = (
      await Promise.all(
        participants.map(async (p) => {
          const data = await ctx.db.get(p.participantId);

          if (!data) return null;

          return getUserPreview(data);
        })
      )
    ).filter((p) => p !== null);

    return {
      type: chat.type,
      chat: {
        id: _id,
        participantsCount: participantsCount,
        dateCreated: _creationTime,
        unreadCount: loggedUserParticipationData.unreadMessages,
        ...others,
      },
      participants: participantsPreview,
    };
  }

  return null;
}

export async function createDirectChat({
  ctx,
  otherParticipantId,
}: {
  ctx: MutationCtx;
  otherParticipantId: Id<"users">;
}): Promise<Id<"chats">> {
  const loggedUser = await getLoggedUser(ctx);
  if (!loggedUser) throw new Error("Unauthorized. You are not logged in.");

  const sortedUsers = [loggedUser.id, otherParticipantId].sort();
  const code = getChatCode(sortedUsers, "direct");

  const chatId = await ctx.db.insert("chats", {
    code,
    creatorId: loggedUser.id,
    type: "direct",
    participantsCount: 2,
  });

  //add the participants
  await Promise.all(
    sortedUsers.map((id) => {
      ctx.db.insert("chatParticipants", {
        chatId,
        participantId: id,
        role: "member",
        unreadMessages: 0,
      });
    })
  );

  return chatId;
}

export async function createCustomChat({
  ctx,
  participantIds,
}: {
  ctx: MutationCtx;
  participantIds: Id<"users">[];
}): Promise<Id<"chats"> | null> {
  if (participantIds.length <= 0) return null;

  const loggedUser = await getLoggedUser(ctx);
  if (!loggedUser) throw new Error("Unauthorized. You are not logged in.");

  const code = getChatCode(participantIds, "custom");

  const chatId = await ctx.db.insert("chats", {
    code,
    type: "custom",
    creatorId: loggedUser.id,
    participantsCount: participantIds.length,
  });

  //Add Participants
  await Promise.all(
    participantIds.map((id) =>
      ctx.db.insert("chatParticipants", {
        chatId,
        participantId: id,
        role: id === loggedUser.id ? "admin" : "member",
        unreadMessages: 0,
      })
    )
  );

  return chatId;
}

export function getChatCode(
  participants: Id<"users">[],
  type: "direct" | "custom"
): string {
  const sorted = [...participants].sort();

  const participantsStr = sorted.join("-");

  return `${type}-${participantsStr}`;
}
