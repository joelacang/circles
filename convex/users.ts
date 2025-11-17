import { v } from "convex/values";
import { action, internalMutation, mutation, query } from "./_generated/server";
import { getLoggedUser, getUserPreview } from "./helpers/users";
import { api, internal } from "./_generated/api";
import { insertStats } from "./helpers/stats";
import { paginationOptsValidator } from "convex/server";
import { UserPreview } from "@/features/users/types";

export const createUser = mutation({
  args: {
    clerkId: v.string(),
    name: v.string(),
    username: v.string(),
    email: v.string(),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    console.log(`createUserMutation activated`);

    const { clerkId, name, username, email, imageUrl } = args;

    const existingEmail = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .unique();

    if (existingEmail)
      throw new Error("Can't create user. Email is already taken.");

    const existingUsername = await ctx.db
      .query("users")
      .withIndex("by_username", (q) => q.eq("username", username))
      .unique();

    if (existingUsername)
      throw new Error("Can't create user. Username is already taken.");

    const userId = await ctx.db.insert("users", {
      clerkId,
      username,
      email,
      imageUrl,
      name,
    });

    await insertStats({ ctx, userId });

    return userId;
  },
});

export const updateUserFromWebhook = action({
  args: {
    clerkId: v.string(),
    name: v.string(),
    username: v.string(),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.runMutation(internal.users.updateUser, {
      clerkId: args.clerkId,
      name: args.name,
      username: args.username,
      imageUrl: args.imageUrl,
    });
  },
});

export const updateUser = internalMutation({
  args: {
    clerkId: v.string(),
    name: v.string(),
    username: v.string(),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .unique();

    if (!user) throw new Error("User not found.");

    await ctx.db.patch(user._id, {
      username: args.username,
      imageUrl: args.imageUrl,
      name: args.name,
    });
  },
});

export const getLoggedUserQuery = query({
  handler: async (ctx) => {
    return await getLoggedUser(ctx);
  },
});

export const updateName = mutation({
  args: {
    firstName: v.union(v.string(), v.null()),
    lastName: v.union(v.string(), v.null()),
    clerkId: v.string(),
  },
  handler: async (ctx, args) => {
    if (!args.firstName && !args.lastName)
      throw new Error("Please provide at least a first name or a last name.");
    const loggedUser = await getLoggedUser(ctx);

    if (!loggedUser) throw new Error("Unauthorized. You are not logged in.");

    if (loggedUser.clerkId !== args.clerkId)
      throw new Error("Unauthorized. clerkId did not match.");

    await ctx.db.patch(loggedUser.id, {
      name: `${args.firstName ?? ""} ${args.lastName ?? ""}`.trim(),
    });

    return { success: true };
  },
});

export const getUserByUsername = query({
  args: { username: v.string() },
  handler: async (ctx, args) => {
    const userData = await ctx.db
      .query("users")
      .withIndex("by_username", (q) => q.eq("username", args.username))
      .unique();

    if (!userData) return null;

    return getUserPreview(userData);
  },
});

export const searchUser = query({
  args: {
    searchValue: v.string(),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const loggedUser = await getLoggedUser(ctx);

    const { searchValue, paginationOpts } = args;
    const results = await ctx.db
      .query("users")
      .withSearchIndex("search_name", (q) => q.search("name", searchValue))
      .paginate(paginationOpts);

    const userPreviews: UserPreview[] = results.page
      .map((u) => getUserPreview(u))
      .filter((u) => u.id !== loggedUser?.id);

    return {
      ...results,
      page: userPreviews.slice(0, paginationOpts.numItems),
    };
  },
});
