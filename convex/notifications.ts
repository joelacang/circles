import { paginationOptsValidator } from "convex/server";
import { query } from "./_generated/server";
import { Notification } from "@/features/notifications/types";
import { NOTIF_ACTION } from "@/types/enum";

export const getNotifications = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    const userIdentity = await ctx.auth.getUserIdentity();

    if (!userIdentity) throw new Error("Unauthorized. You are not logged in.");
    const loggedUserId = userIdentity.subject;

    const results = await ctx.db
      .query("notifications")
      .withIndex("by_recipientId", (q) => q.eq("recipientId", loggedUserId))
      .paginate(args.paginationOpts);

    const notifications: Notification[] = results.page.map((n) => ({
      id: n._id,
      recipientId: n.recipientId,
      senderIds: n.senderIds.map((s) => ({
        dateCreated: s._creationTime,
        senderId: s.senderId,
      })),
      groupDate: n.groupDate,
      action: n.source.action as NOTIF_ACTION,
      postId: "postId" in n.source ? n.source.postId : undefined,
      commentId: "commentId" in n.source ? n.source.commentId : undefined,
    }));

    return {
      ...results,
      page: notifications,
    };
  },
});
