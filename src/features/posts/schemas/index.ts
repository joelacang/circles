import { AUDIENCE } from "@/types/enum";
import z from "zod";

export const createPostSchema = z.object({
  body: z
    .string()
    .min(4, "Post should be at least 4 characters")
    .max(350, "Post should not be more than 350 characters"),
  attachments: z.array(z.string()),
  quotedPostId: z.string().optional(),
  groupPostId: z.string().optional(),
  audience: z.enum(AUDIENCE),
});

export type CreatePost = z.infer<typeof createPostSchema>;
