import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { cn } from "@/lib/utils";
import UserAvatar from "./user-avatar";
import { UserPreview } from "@/features/users/types";
import { useRouter } from "next/navigation";
import { SIZE } from "@/types/enum";
import ProfileHoverCard from "@/features/profiles/components/profile-hover-card";
import { UserNameButton } from "./username-button";

interface Props {
  variant?: "default" | "outline" | "muted";
  size?: "default" | "sm" | "micro";
  className?: string;
  titleExt?: React.ReactNode;
  subtitle?: string;
  user: UserPreview;
  mode?: "hover" | "click";
}

const UserItem = ({
  variant = "default",
  size = "default",
  className,
  titleExt,
  subtitle,
  user,
  mode,
}: Props) => {
  return (
    <Item
      variant={variant}
      className={cn("w-full", size === "sm" ? "p-1 gap-3" : "p-3", className)}
    >
      <ItemMedia>
        {mode === "hover" ? (
          <ProfileHoverCard user={user}>
            <UserAvatar
              size={
                size === "default"
                  ? SIZE.DEFAULT
                  : size === "sm"
                    ? SIZE.SMALL
                    : SIZE.MICRO
              }
              imageUrl={user.imageUrl}
              fallback={user.username ?? "U"}
              className="border border-white"
            />
          </ProfileHoverCard>
        ) : (
          <UserAvatar
            size={
              size === "default"
                ? SIZE.DEFAULT
                : size === "sm"
                  ? SIZE.SMALL
                  : SIZE.MICRO
            }
            imageUrl={user.imageUrl}
            fallback={user.username ?? "U"}
            className="border border-white"
          />
        )}
      </ItemMedia>
      <ItemContent className="flex flex-col items-start justify-center">
        {mode === "hover" ? (
          <ProfileHoverCard user={user}>
            <UserNameButton user={user} />
          </ProfileHoverCard>
        ) : mode === "click" ? (
          <UserNameButton user={user} />
        ) : (
          <ItemTitle className="font-semibold">{user.name}</ItemTitle>
        )}
        {/* <div
          className={cn(
            "leading-none size-fit p-0 font-semibold ",
            redirectable &&
              "cursor-pointer text-primary underline underline-offset-2"
          )}
          onClick={() => {
            if (redirectable) {
              router.push(
                loggedUser && loggedUser.id === user.id
                  ? "/profile"
                  : `/@${user.username}`
              );
            }
          }}
        >{`${user.firstName} ${user.lastName}`}</div> */}
        {titleExt}

        {subtitle && (
          <p
            className={cn(
              "leading-none text-xs ",
              size === "sm" && "line-clamp-1"
            )}
          >
            {subtitle}
          </p>
        )}
      </ItemContent>
    </Item>
  );
};

export default UserItem;
