import { Id } from "../../../../convex/_generated/dataModel";

export type Comment = {
  id: Id<"comments">;
  body: string;
  authorId: string;
  likes: number;
  comments: number;
  postId: Id<"posts">;
  parentCommentId: Id<"comments"> | null;
  dateCreated: number;
  isLiked: boolean;
};
