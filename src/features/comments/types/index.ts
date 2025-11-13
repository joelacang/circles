import { UserPreview } from "@/features/users/types";
import { Id } from "../../../../convex/_generated/dataModel";

export type Comment = {
  id: Id<"comments">;
  body: string;
  author: UserPreview;
  likes: number;
  comments: number;
  postId: Id<"posts">;
  parentCommentId: Id<"comments"> | null;
  dateCreated: number;
  isLiked: boolean;
};
