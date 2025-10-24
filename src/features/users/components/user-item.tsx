import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import UserAvatar from "./user-avatar";
import { User } from "@/features/users/types";

interface Props {
  variant?: "default" | "outline" | "muted";
  size?: "default" | "sm" | "micro";
  className?: string;
  titleExt?: React.ReactNode;
  subtitle?: string;
  user: User;
}
const UserItem = ({
  variant = "default",
  size = "default",
  className,
  titleExt,
  subtitle,
  user,
}: Props) => {
  if (!user) {
    return (
      <div>
        <p>User Not Found!</p>
      </div>
    );
  }

  return (
    <Item
      variant={variant}
      size={size === "micro" ? "sm" : size}
      className={cn("w-full", size === "sm" ? "p-2" : "p-3", className)}
    >
      <ItemMedia>
        <UserAvatar imageUrl={user.imageUrl} fallback={user.username ?? "U"} />
      </ItemMedia>
      <ItemContent className="flex flex-col items-start justify-center">
        <ItemTitle className=" flex flex-row gap-2">
          <span className="leading-none font-semibold">{user.name}</span>
          {titleExt}
        </ItemTitle>
        {subtitle && (
          <ItemDescription className="leading-none">{subtitle}</ItemDescription>
        )}
      </ItemContent>
    </Item>
  );
};

export default UserItem;
