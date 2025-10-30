import { v } from "convex/values";
import { action, mutation } from "./_generated/server";
import { clerkClient } from "../src/features/clerk";
import { getUserPreview } from "./helpers/users";

export const getUserDetails = action({
  args: {
    clerkId: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const user = await clerkClient.users.getUser(args.clerkId);

      return getUserPreview(user);
    } catch (error) {
      console.error("Error fetching user details:", error);
      throw new Error("Failed to fetch user details");
    }
  },
});

export const getUserByUsername = action({
  args: { username: v.string() },
  handler: async (ctx, args) => {
    try {
      const users = await clerkClient.users.getUserList({
        limit: 1,
        username: [args.username],
      });

      if (users.data.length === 0) return null;

      const user = users.data[0];

      return getUserPreview(user);
    } catch (error) {
      console.error("Error fetching user details:", error);
      throw new Error("Failed to fetch user details");
    }
  },
});
