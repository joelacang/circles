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
import { UserPreview } from "@/features/users/types";
import { useRouter } from "next/navigation";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import ProfileHoverCard from "@/features/profiles/components/profile-hover-card";

interface Props {
  variant?: "default" | "outline" | "muted";
  size?: "default" | "sm" | "micro";
  className?: string;
  titleExt?: React.ReactNode;
  subtitle?: string;
  user: UserPreview;
  redirectable?: boolean;
}
const UserItem = ({
  variant = "default",
  size = "default",
  className,
  titleExt,
  subtitle,
  user,
  redirectable = false,
}: Props) => {
  const router = useRouter();
  const { user: loggedUser } = useUser();
  const fullName = `${user.firstName} ${user.lastName}`;
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
        {redirectable ? (
          <HoverCard>
            <HoverCardTrigger asChild>
              <Button
                variant="link"
                className="size-fit p-0 font-semibold text-base"
              >
                {fullName}
              </Button>
            </HoverCardTrigger>
            <HoverCardContent
              className="p-4 m-2 w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <ProfileHoverCard user={user} />
            </HoverCardContent>
          </HoverCard>
        ) : (
          <ItemTitle>{fullName}</ItemTitle>
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
          <ItemDescription className="leading-none">{subtitle}</ItemDescription>
        )}
      </ItemContent>
    </Item>
  );
};

export default UserItem;
