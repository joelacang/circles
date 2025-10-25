import z from "zod";

export const createCommentSchema = z.object({
  body: z
    .string()
    .min(4, "Comment must be at least 4 characters")
    .max(350, "Comment must be less than 350 characters"),
  parentCommentId: z.string().optional(),
  postId: z.string(),
});

export type CreateComment = z.infer<typeof createCommentSchema>;
