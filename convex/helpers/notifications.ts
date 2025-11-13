import { Doc, Id } from "../_generated/dataModel";
import { MutationCtx } from "../_generated/server";
import { format } from "date-fns-tz";
import { getLoggedUser } from "./users";

export type RecipientData = {
  id: Id<"users">;
  type: "author" | "tag" | "mention" | "follow";
};

export async function addNotification({
  ctx,
  recipients,
  source,
}: {
  ctx: MutationCtx;
  recipients: RecipientData[];
  source:
    | { action: "like"; postId: Id<"posts"> }
    | { action: "comment"; postId: Id<"posts"> }
    | { action: "mention"; postId: Id<"posts"> }
    | { action: "quote"; postId: Id<"posts"> }
    | { action: "follow"; followedUserId: Id<"users"> }
    | { action: "comment"; commentId: Id<"comments"> }
    | { action: "like"; commentId: Id<"comments"> }
    | { action: "mention"; commentId: Id<"comments"> };
}): Promise<Id<"notifications"> | null> {
  const loggedUser = await getLoggedUser(ctx);
  if (!loggedUser) throw new Error("Unauthorized. You are not logged in.");

  const now = Date.now();

  // Use UTC date for consistent grouping
  const groupDate = format(now, "yyyy-MM-dd", { timeZone: "UTC" });

  //Look for existing notification
  let notification: Doc<"notifications"> | null = null;

  if ("postId" in source) {
    notification = await ctx.db
      .query("notifications")
      .withIndex("by_action_postId_date", (q) =>
        q
          .eq("source.action", source.action)
          .eq("source.postId", source.postId)
          .eq("groupDate", groupDate)
      )
      .unique();
  } else if ("commentId" in source) {
    notification = await ctx.db
      .query("notifications")
      .withIndex("by_action_commentId_date", (q) =>
        q
          .eq("source.action", source.action)
          .eq("source.commentId", source.commentId)
          .eq("groupDate", groupDate)
      )
      .unique();
  } else if (source.action === "follow") {
    notification = await ctx.db
      .query("notifications")
      .withIndex("by_action_userId_groupDate", (q) =>
        q
          .eq("source.action", "follow")
          .eq("source.followedUserId", source.followedUserId)
          .eq("groupDate", groupDate)
      )
      .unique();
  }

  const notificationId =
    notification?._id ??
    (await ctx.db.insert("notifications", { groupDate, source }));

  //Add Recipients
  await Promise.all(
    recipients.map(async (recipient) => {
      if (recipient.id === loggedUser.id) return;

      await addNotifRecipient({
        ctx,
        recipient,
        notificationId,
      });
    })
  );

  //Add Sender
  const existingSender = await ctx.db
    .query("notificationSenders")
    .withIndex("by_notificationId_senderId", (q) =>
      q.eq("notificationId", notificationId).eq("senderId", loggedUser.id)
    )
    .unique();

  if (!existingSender) {
    await ctx.db.insert("notificationSenders", {
      notificationId,
      senderId: loggedUser.id,
    });
  }

  return notificationId;
}

export async function addNotifRecipient({
  ctx,
  recipient,
  notificationId,
}: {
  ctx: MutationCtx;
  recipient: RecipientData;
  notificationId: Id<"notifications">;
}): Promise<Id<"notificationRecipients"> | null> {
  const existing = await ctx.db
    .query("notificationRecipients")
    .withIndex("by_notificationId_recipientId_type", (q) =>
      q
        .eq("notificationId", notificationId)
        .eq("recipientId", recipient.id)
        .eq("type", recipient.type)
    )
    .unique();

  if (!existing) {
    const id = await ctx.db.insert("notificationRecipients", {
      notificationId,
      recipientId: recipient.id,
      type: recipient.type,
    });

    //Update Unread Count
    const stats = await ctx.db
      .query("stats")
      .withIndex("by_userId", (q) => q.eq("userId", recipient.id))
      .unique();

    if (stats) {
      await ctx.db.patch(stats._id, {
        unreadNotifs: (stats.unreadNotifs ?? 0) + 1,
      });
    }

    return id;
  }

  return null;
}

export async function addPostNotification({
  ctx,
  source,
}: {
  ctx: MutationCtx;
  source:
    | { action: "like"; postId: Id<"posts"> }
    | { action: "comment"; postId: Id<"posts"> }
    | { action: "quote"; postId: Id<"posts"> };
}): Promise<Id<"notifications"> | null> {
  const post = await ctx.db.get(source.postId);
  if (!post) throw new Error("Post not found.");

  const loggedUser = await getLoggedUser(ctx);
  if (!loggedUser) throw new Error("Unauthorized. You are not logged in.");

  //Get tags and mentions;
  const taggedUsers: RecipientData[] = (
    await ctx.db
      .query("postTags")
      .withIndex("by_postId", (q) => q.eq("postId", source.postId))
      .collect()
  ).map((t) => ({ id: t.taggedUserId, type: "tag" }));

  const mentionedUsers: RecipientData[] = (
    await ctx.db
      .query("postMentions")
      .withIndex("by_postId", (q) => q.eq("postId", source.postId))
      .collect()
  ).map((m) => ({ id: m.mentionedUserId, type: "mention" }));

  //Avoid duplicates recipient Ids
  const allRecipients: RecipientData[] = [
    { type: "author" as const, id: post.authorId },
    ...taggedUsers,
    ...mentionedUsers,
  ];

  const uniqueRecipients = deDupRecipients(allRecipients);

  const notificationId = await addNotification({
    ctx,
    recipients: uniqueRecipients,
    source,
  });
  return notificationId;
}

export async function addCommentNotification({
  ctx,
  source,
}: {
  ctx: MutationCtx;
  source:
    | { action: "like"; commentId: Id<"comments"> }
    | { action: "comment"; commentId: Id<"comments"> }
    | { action: "mention"; commentId: Id<"comments"> };
}): Promise<Id<"notifications"> | null> {
  const comment = await ctx.db.get(source.commentId);
  if (!comment) throw new Error("Comment not found.");

  const loggedUser = await getLoggedUser(ctx);
  if (!loggedUser) throw new Error("Unauthorized. You are not logged in.");

  //Get tags and mentions;
  const mentionedUsers: RecipientData[] = (
    await ctx.db
      .query("commentMentions")
      .withIndex("by_commentId", (q) => q.eq("commentId", source.commentId))
      .collect()
  ).map((m) => ({ id: m.mentionedUserId, type: "mention" }));

  //Avoid duplicates recipient Ids
  const allRecipients = [
    { type: "author" as const, id: comment.authorId },
    ...mentionedUsers,
  ];

  const uniqueRecipients = deDupRecipients(allRecipients);

  const notificationId = await addNotification({
    ctx,
    recipients: uniqueRecipients,
    source,
  });

  return notificationId;
}

export function deDupRecipients(recipients: RecipientData[]): RecipientData[] {
  const precedence: Record<RecipientData["type"], number> = {
    follow: 4,
    author: 3,
    tag: 2,
    mention: 1,
  };

  const deduped = new Map<Id<"users">, RecipientData>();

  for (const r of recipients) {
    const existing = deduped.get(r.id);

    if (!existing) {
      deduped.set(r.id, r);
    } else {
      // Replace only if current has higher precedence
      if (precedence[r.type] > precedence[existing.type]) {
        deduped.set(r.id, r);
      }
    }
  }

  return Array.from(deduped.values());
}
