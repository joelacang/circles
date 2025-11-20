import { UserPreview } from "@/features/users/types";
import { Doc, Id } from "../_generated/dataModel";
import { QueryCtx } from "../_generated/server";

export function getUserPreview(user: Doc<"users">): UserPreview {
  const { _id, clerkId, name, username, imageUrl } = user;
  return {
    id: _id,
    clerkId,
    name,
    username,
    imageUrl,
  } satisfies UserPreview;
}

export async function getLoggedUser(
  ctx: QueryCtx
): Promise<UserPreview | null> {
  const userIdentity = await ctx.auth.getUserIdentity();
  if (!userIdentity) return null;

  const loggedUser = await ctx.db
    .query("users")
    .withIndex("by_clerkId", (q) => q.eq("clerkId", userIdentity.subject))
    .unique();

  if (!loggedUser) return null;

  return getUserPreview(loggedUser);
}

export async function getUser({
  ctx,
  userId,
}: {
  ctx: QueryCtx;
  userId: Id<"users">;
}): Promise<UserPreview | null> {
  const user = await ctx.db.get(userId);

  if (!user) return null;

  return getUserPreview(user);
}
