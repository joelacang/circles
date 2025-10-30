import { UserPreview } from "@/features/users/types";
import { User } from "@clerk/backend";

export function getUserPreview(user: User): UserPreview {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    username: user.username,
    imageUrl: user.imageUrl,
  };
}
