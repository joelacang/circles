import { v } from "convex/values";
import { action, mutation } from "./_generated/server";
import { clerkClient } from "../src/features/clerk";
import { User } from "@/features/users/types";

export const updateProfile = mutation({
  args: {
    profileId: v.optional(v.id("profiles")),
    firstName: v.string(),
    lastName: v.string(),
    username: v.string(),
    dateOfBirth: v.number(),
    website: v.optional(v.string()),
    bio: v.optional(v.string()),
    isPrivate: v.boolean(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) throw new Error("Not authenticated");

    const clerkId = identity.subject;

    const res = await fetch(`https://api.clerk.com/v1/users/${clerkId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
      },
      body: JSON.stringify({
        first_name: args.firstName,
        last_name: args.lastName,
        username: args.username,
      }),
    });

    if (!res.ok) {
      const error = await res.text();

      throw new Error(`Failed to update user in Clerk: ${error}`);
    }

    if (!args.profileId) {
      return await ctx.db.insert("profiles", {
        clerkId,
        dateOfBirth: args.dateOfBirth,
        website: args.website,
        bio: args.bio,
        isPrivate: args.isPrivate,
      });
    }

    return await ctx.db.patch(args.profileId, {
      dateOfBirth: args.dateOfBirth,
      website: args.website,
      bio: args.bio,
      isPrivate: args.isPrivate,
    });
  },
});

export const getUserDetails = action({
  args: {
    clerkId: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const user = await clerkClient.users.getUser(args.clerkId);

      return {
        id: user.id,
        name: user.fullName ?? "",
        username: user.username,
        imageUrl: user.imageUrl,
      } as User;
    } catch (error) {
      console.error("Error fetching user details:", error);
      throw new Error("Failed to fetch user details");
    }
  },
});
