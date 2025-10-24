import { User } from "@/features/users/types";
import { Id } from "../../../../convex/_generated/dataModel";
import { AUDIENCE } from "@/types/enum";

export type Post = {
  id: Id<"posts">;
  body: string;
  authorId: string;
  author: User | null;
  quotedPostId?: Id<"posts"> | null;
  attachments: string[];
  likes: number;
  comments: number;
  bookmarks: number;
  quotes: number;
  audience: AUDIENCE;
  dateCreated: number;
  isLiked: boolean;
  isBookmarked: boolean;
};
