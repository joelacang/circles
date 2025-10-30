import { Id } from "../../../../convex/_generated/dataModel";

export type Profile = {
  id: Id<"profiles">;
  clerkId: string;
  dateOfBirth: number;
  followers: number;
  followings: number;
  posts: number;
  website?: string | null;
  bio?: string | null;
  isPrivate: boolean;
};
