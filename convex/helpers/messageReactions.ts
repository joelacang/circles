import { EmojiGroupCount } from "@/features/chats/types";
import { QueryCtx } from "../_generated/server";
import { Id } from "../_generated/dataModel";

export async function getAllMessageReactCounts({
  ctx,
  messageId,
}: {
  ctx: QueryCtx;
  messageId: Id<"messages">;
}): Promise<EmojiGroupCount[]> {
  const results = await ctx.db
    .query("messageReactions")
    .withIndex("by_messageId", (q) => q.eq("messageId", messageId))
    .collect();

  // Group by emojiCode
  const groups: Record<string, { emojiNative: string; count: number }> = {};

  for (const r of results) {
    if (!groups[r.emojiCode]) {
      groups[r.emojiCode] = { emojiNative: r.emojiNative, count: 1 };
    } else {
      groups[r.emojiCode].count += 1;
    }
  }

  return Object.entries(groups)
    .map(([emojiCode, { emojiNative, count }]) => ({
      emojiCode,
      emojiNative,
      count,
    }))
    .sort((a, b) => b.count - a.count);
}
