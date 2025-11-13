import { UserPreview } from "@/features/users/types";
import { Id } from "../../../../convex/_generated/dataModel";

export type Profile = {
  id: Id<"profiles">;
  user: UserPreview;
  dateOfBirth: number;
  followers: number;
  followings: number;
  posts: number;
  website?: string | null;
  bio?: string | null;
  isPrivate: boolean;
};
