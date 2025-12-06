import { Attachment } from "@/features/attachments/types";
import { Id } from "../_generated/dataModel";
import { QueryCtx } from "../_generated/server";

export async function getPostAttachments({
  ctx,
  postId,
}: {
  ctx: QueryCtx;
  postId: Id<"posts">;
}): Promise<Attachment[]> {
  const postAttachments = await ctx.db
    .query("postAttachments")
    .withIndex("by_postId", (q) => q.eq("postId", postId))
    .collect();

  const attachments: Attachment[] = (
    await Promise.all(
      postAttachments.map(async (a) => {
        const url = await ctx.storage.getUrl(a.storageId);

        if (!url) return null;
        return {
          id: a._id,
          storageId: a.storageId,
          url,
        } satisfies Attachment;
      })
    )
  ).filter((a) => a !== null);

  return attachments;
}
