import { paginationOptsValidator } from "convex/server";
import { mutation, query } from "./_generated/server";
import { Notification, Sender } from "@/features/notifications/types";
import { v } from "convex/values";
import { getLoggedUser, getUserPreview } from "./helpers/users";
import { updateStats } from "./helpers/stats";

export const getNotifications = query({
  args: {
    senderLimit: v.optional(v.number()),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const loggedUser = await getLoggedUser(ctx);
    if (!loggedUser) throw new Error("Unauthorized. You are not logged in.");

    const results = await ctx.db
      .query("notificationRecipients")
      .withIndex("by_recipientId_lastUpdateTime", (q) =>
        q.eq("recipientId", loggedUser.id)
      )
      .order("desc")
      .paginate(args.paginationOpts);

    const senderLimit = args.senderLimit ?? 3;

    const notifications: Notification[] = (
      await Promise.all(
        results.page.map(async (notifRecipient) => {
          const notification = await ctx.db.get(notifRecipient.notificationId);

          if (!notification) return null;

          const senders = await ctx.db
            .query("notificationSenders")
            .withIndex("by_notificationId", (q) =>
              q.eq("notificationId", notifRecipient.notificationId)
            )
            .collect();

          const sendersDetails: Sender[] = (
            await Promise.all(
              senders.map(async (sender, index) => {
                if (index < senderLimit) {
                  const details = await ctx.db.get(sender.senderId);

                  if (!details) return null;

                  return {
                    user: getUserPreview(details),
                    dateSent: sender._creationTime,
                  };
                }

                return null;
              })
            )
          ).filter((s) => s !== null);

          const { _id, groupDate, _creationTime, source, preview, updateTime } =
            notification;

          return {
            id: _id,
            groupDate,
            recipientType: notifRecipient.type,
            recipientId: notifRecipient._id,
            senders: {
              details: sendersDetails,
              remaining: senders.length - senderLimit,
            },
            action: source.action,
            postId: "postId" in source ? source.postId : undefined,
            commentId: "commentId" in source ? source.commentId : undefined,
            dateCreated: _creationTime,
            readTime: notifRecipient.readTime,
            updateTime,
            preview,
          };
        })
      )
    ).filter((n) => n !== null);

    return {
      ...results,
      page: notifications,
    };
  },
});

export const getUnreadNotifCount = query({
  handler: async (ctx) => {
    const loggedUser = await getLoggedUser(ctx);
    if (!loggedUser) return 0;

    const stats = await ctx.db
      .query("stats")
      .withIndex("by_userId", (q) => q.eq("userId", loggedUser.id))
      .unique();

    return stats?.unreadNotifs ?? 0;
  },
});

export const read = mutation({
  args: {
    notifRecipientId: v.id("notificationRecipients"),
  },
  handler: async (ctx, args) => {
    const notifRecipient = await ctx.db.get(args.notifRecipientId);
    if (!notifRecipient) throw new Error("Data not found.");

    const loggedUser = await getLoggedUser(ctx);
    if (!loggedUser) throw new Error("Unauthorized. You are not logged in.");

    if (notifRecipient.recipientId !== loggedUser.id)
      throw new Error("The userId did not match.");

    await ctx.db.patch(args.notifRecipientId, {
      readTime: new Date().getTime(),
    });

    await updateStats({
      ctx,
      userId: loggedUser.id,
      mode: "deduct",
      field: "unread",
    });

    return { success: true };
  },
});
