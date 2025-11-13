import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Profile } from "@/features/profiles/types";
import { updateStats } from "./helpers/stats";
import { getLoggedUser, getUserPreview } from "./helpers/users";

export const upsert = mutation({
  args: {
    profileId: v.optional(v.id("profiles")),
    dateOfBirth: v.number(),
    website: v.optional(v.string()),
    bio: v.optional(v.string()),
    isPrivate: v.boolean(),
  },
  handler: async (ctx, args) => {
    const loggedUser = await getLoggedUser(ctx);
    if (!loggedUser) throw new Error("Unauthorized. You are not logged in.");

    // Prepare the data to update or insert
    const profileData: Partial<typeof args> = {
      isPrivate: args.isPrivate,
      dateOfBirth: args.dateOfBirth,
      ...(args.website !== undefined && { website: args.website }),
      ...(args.bio !== undefined && { bio: args.bio }),
    };

    if (args.profileId) {
      // Updating an existing profile by ID
      const existingProfile = await ctx.db.get(args.profileId);
      if (!existingProfile) throw new Error("Profile not found.");

      if (existingProfile.userId !== loggedUser.id)
        throw new Error("Cannot update profile: userId does not match.");

      await ctx.db.patch(existingProfile._id, profileData);
      return existingProfile._id;
    }

    // Try to find an existing profile for the logged user
    const existingProfile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", loggedUser.id))
      .unique();

    if (existingProfile) {
      // Update existing profile
      await ctx.db.patch(existingProfile._id, profileData);
      return existingProfile._id;
    }

    // Insert a new profile
    const newProfileId = await ctx.db.insert("profiles", {
      ...args,
      userId: loggedUser.id,
    });

    return newProfileId;
  },
});

export const getProfile = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);

    if (!user) throw new Error("User not found.");

    const result = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .unique();

    if (!result) return null;

    const stats = await ctx.db
      .query("stats")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .unique();

    const profile: Profile = {
      ...result,
      id: result._id,
      user: getUserPreview(user),
      followers: stats?.followers ?? 0,
      followings: stats?.following ?? 0,
      posts: stats?.posts ?? 0,
    };

    return profile;
  },
});
