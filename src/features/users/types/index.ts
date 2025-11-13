import { Id } from "../../../../convex/_generated/dataModel";

export type UserPreview = {
  id: Id<"users">;
  clerkId: string;
  name: string | null;
  username: string;
  imageUrl?: string | null;
};
