import { cn } from "@/lib/utils";
import { UserPreview } from "../types";
import UserItem from "./user-item";
import { CheckCircle2 } from "lucide-react";

interface Props {
  user: UserPreview;
  selected?: boolean;
}
const UserSearchResultItem = ({ user, selected = false }: Props) => {
  return (
    <div
      className={cn(
        selected && "bg-gradient-to-b from-violet-400  to-purple-600",
        "flex items-center justify-between"
      )}
    >
      <UserItem
        user={user}
        className={cn(selected && "text-white")}
        size="sm"
        subtitle={`@${user.username}`}
      />
      {selected && (
        <div className="pr-2">
          <CheckCircle2 />
        </div>
      )}
    </div>
  );
};

export default UserSearchResultItem;
