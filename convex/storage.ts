import { mutation } from "./_generated/server";

export const generateUploadURL = mutation({
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});
