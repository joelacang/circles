import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Profile } from "@/features/profiles/types";
import { updateStats } from "./helpers/stats";

export const upsert = mutation({
  args: {
    profileId: v.optional(v.id("profiles")),
    clerkId: v.string(),
    dateOfBirth: v.number(),
    website: v.optional(v.string()),
    bio: v.optional(v.string()),
    isPrivate: v.boolean(),
  },
  handler: async (ctx, args) => {
    const userIdentity = await ctx.auth.getUserIdentity();
    if (!userIdentity) throw new Error("Unauthorized.");

    if (userIdentity.subject !== args.clerkId)
      throw new Error("You cannot modify another user's profile.");

    if (args.profileId) {
      const existingProfile = await ctx.db.get(args.profileId);

      if (!existingProfile) throw new Error("Profile not found.");

      if (existingProfile.clerkId !== args.clerkId)
        throw new Error("Can't update profile. userId does not match");

      const updateData: Partial<typeof args> = {};

      if (args.dateOfBirth !== undefined)
        updateData.dateOfBirth = args.dateOfBirth;
      if (args.website !== undefined) updateData.website = args.website;
      if (args.bio !== undefined) updateData.bio = args.bio;
      updateData.isPrivate = args.isPrivate;

      await ctx.db.patch(existingProfile._id, updateData);
      return existingProfile._id;
    }

    const profileId = await ctx.db.insert("profiles", args);

    await updateStats({ ctx, clerkId: args.clerkId, field: "none" });

    return profileId;
  },
});

export const getProfile = query({
  args: {
    clerkId: v.string(),
  },
  handler: async (ctx, args) => {
    const result = await ctx.db
      .query("profiles")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .unique();

    if (!result) return null;

    const stats = await ctx.db
      .query("stats")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .unique();

    const profile: Profile = {
      ...result,
      id: result._id,
      clerkId: result.clerkId,
      followers: stats?.followers ?? 0,
      followings: stats?.following ?? 0,
      posts: stats?.posts ?? 0,
    };

    return profile;
  },
});
