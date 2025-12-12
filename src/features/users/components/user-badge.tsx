import { SIZE } from "@/types/enum";
import UserAvatar from "./user-avatar";
import { cn } from "@/lib/utils";
import ProfileHoverCard from "@/features/profiles/components/profile-hover-card";
import { UserPreview } from "../types";
import CloseButton from "@/components/close-button";
import { Id } from "../../../../convex/_generated/dataModel";

interface Props {
  user: UserPreview;
  onRemove?: (userId: Id<"users">) => void;
}
const UserBadge = ({ user, onRemove }: Props) => {
  return (
    <div
      className={cn(
        "flex items-center gap-2 border bg-card shadow-sm rounded-full p-1 h-fit shrink-0 max-w-48",
        !onRemove && "pr-2"
      )}
    >
      <ProfileHoverCard user={user}>
        <div className="flex items-center gap-2 cursor-pointer min-w-0 ">
          <UserAvatar
            imageUrl={user.imageUrl}
            size={SIZE.MICRO}
            className="bg-gray-500 shrink-0"
          />

          <p className={cn("text-xs font-semibold truncate min-w-0 max-w-28")}>
            {user.name}
          </p>
        </div>
      </ProfileHoverCard>
      {onRemove && (
        <CloseButton tooltip="Remove" onClick={() => onRemove(user.id)} />
      )}
    </div>
  );
};

export default UserBadge;
