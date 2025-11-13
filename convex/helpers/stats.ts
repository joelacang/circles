import { stat } from "fs";
import { Doc, Id } from "../_generated/dataModel";
import { MutationCtx } from "../_generated/server";

export async function insertStats({
  ctx,
  userId,
}: {
  ctx: MutationCtx;
  userId: Id<"users">;
}): Promise<Id<"stats">> {
  return await ctx.db.insert("stats", {
    userId,
    followers: 0,
    following: 0,
    posts: 0,
    unreadNotifs: 0,
  });
}

export async function updateStats({
  ctx,
  userId,
  mode,
  field,
}: {
  ctx: MutationCtx;
  userId: Id<"users">;
  mode: "add" | "deduct";
  field: "posts" | "followers" | "following" | "unread" | "none";
}): Promise<void> {
  let currentStats: Doc<"stats">;

  // Fetch existing stats
  const stats = await ctx.db
    .query("stats")
    .withIndex("by_userId", (q) => q.eq("userId", userId))
    .unique();

  if (stats) {
    currentStats = stats;
  } else {
    //Insert new data if not found;
    const newStatId = await insertStats({ ctx, userId });
    const newStats = await ctx.db.get(newStatId);

    if (!newStats) {
      throw new Error("Failed to create stats record");
    }

    currentStats = newStats;
  }

  // Prepare update object
  const updateData: Partial<{
    posts: number;
    followers: number;
    following: number;
    unreadNotifs: number;
  }> = {};

  if (field !== "none") {
    const increment = mode === "add" ? 1 : -1;

    switch (field) {
      case "posts":
        updateData.posts = Math.max((currentStats.posts || 0) + increment, 0);
        break;
      case "followers":
        updateData.followers = Math.max(
          (currentStats.followers || 0) + increment,
          0
        );
        break;
      case "following":
        updateData.following = Math.max(
          (currentStats.following || 0) + increment,
          0
        );
        break;
      case "unread":
        updateData.unreadNotifs = Math.max(
          (currentStats.unreadNotifs || 0) + increment,
          0
        );
    }

    await ctx.db.patch(currentStats._id, updateData);
  }
}
