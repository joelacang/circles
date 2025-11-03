import { Id } from "../_generated/dataModel";
import { MutationCtx } from "../_generated/server";
import { format } from "date-fns-tz";

export async function addNotification({
  ctx,
  recipientId,
  source,
}: {
  ctx: MutationCtx;
  recipientId: string;
  source:
    | { action: "like"; postId: Id<"posts"> }
    | { action: "comment"; postId: Id<"posts"> }
    | { action: "mention"; postId: Id<"posts"> }
    | { action: "quote"; postId: Id<"posts"> }
    | { action: "follow" }
    | { action: "comment"; commentId: Id<"comments"> }
    | { action: "like"; commentId: Id<"comments"> };
}): Promise<Id<"notifications"> | null> {
  const userIdentity = await ctx.auth.getUserIdentity();
  if (!userIdentity) throw new Error("Unauthorized. You are not logged in.");

  const senderId = userIdentity.subject;
  if (senderId === recipientId) return null;

  const now = Date.now();

  // Use UTC date for consistent grouping
  const groupDate = format(now, "yyyy-MM-dd", { timeZone: "UTC" });

  let existing;
  if ("postId" in source) {
    existing = await ctx.db
      .query("notifications")
      .withIndex("by_recipientId_action_postId_date", (q) =>
        q
          .eq("recipientId", recipientId)
          .eq("source.action", source.action)
          .eq("source.postId", source.postId)
          .eq("groupDate", groupDate)
      )
      .first();
  } else if ("commentId" in source) {
    existing = await ctx.db
      .query("notifications")
      .withIndex("by_recipientId_action_commentId_date", (q) =>
        q
          .eq("recipientId", recipientId)
          .eq("source.action", source.action)
          .eq("source.commentId", source.commentId)
          .eq("groupDate", groupDate)
      )
      .first();
  } else {
    existing = await ctx.db
      .query("notifications")
      .withIndex("by_recipientId", (q) => q.eq("recipientId", recipientId))
      .first();
  }

  if (existing) {
    const alreadyPresent = existing.senderIds.some(
      (s) => s.senderId === senderId
    );
    if (!alreadyPresent) {
      await ctx.db.patch(existing._id, {
        senderIds: [
          ...existing.senderIds,
          { senderId, _creationTime: now },
        ].sort((a, b) => b._creationTime - a._creationTime), // most recent first
      });
    }
    return existing._id;
  } else {
    const newNotifId = await ctx.db.insert("notifications", {
      groupDate,
      recipientId,
      senderIds: [{ senderId, _creationTime: now }],
      source,
    });
    return newNotifId;
  }
}
