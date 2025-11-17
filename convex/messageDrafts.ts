import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { getLoggedUser } from "./helpers/users";

export const create = mutation({
  args: {
    recipients: v.array(v.id("users")),
    body: v.string(),
  },
  handler: async (ctx, args) => {
    const loggedUser = await getLoggedUser(ctx);
    if (!loggedUser) throw new Error("Unauthorized. You are not logged in.");

    const { recipients, body } = args;

    if (body.trim() === "" && recipients.length === 0) {
      return null;
    }

    const draftId = await ctx.db.insert("messageDrafts", {
      body,
      authorId: loggedUser.id,
    });

    if (recipients.length > 0) {
      await Promise.all(
        recipients.map(async (id) => {
          await ctx.db.insert("messageDraftRecipients", {
            messageDraftId: draftId,
            recipientId: id,
          });
        })
      );
    }

    return draftId;
  },
});
