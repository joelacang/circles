import { useGetUserDetails } from "@/features/users/hooks/use-get-user-details";
import { Notification } from "../types";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import UserAvatar from "@/features/users/components/user-avatar";
import { useTranslation } from "react-i18next";
import { getNotificationDisplay } from "../utils";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import React from "react";

interface Props {
  notif: Notification;
}

const NotificationCard = ({ notif }: Props) => {
  const { user } = useGetUserDetails(notif.senderIds[0].senderId);
  const { t } = useTranslation();
  const notifDisplay = getNotificationDisplay({
    action: notif.action,
    mode: notif.postId ? "post" : "comment",
  });
  return (
    <Item className="hover:bg-accent cursor-pointer  px-2 pt-2 pb-4">
      <ItemMedia className="relative">
        <UserAvatar imageUrl={user?.imageUrl} />
        <div
          className={cn(
            "absolute -bottom-2 -right-2 size-fit p-1 shadow-md  rounded-full bg-gradient-to-br from-[_var(--col-light)] to-[_var(--col-dark)]"
          )}
          style={
            {
              "--col-dark": notifDisplay.darkColor,
              "--col-primary": notifDisplay.primaryColor,
              "--col-light": notifDisplay.lightColor,
            } as React.CSSProperties
          }
        >
          <notifDisplay.icon className="size-4 text-white" />
        </div>
      </ItemMedia>
      <ItemContent>
        <p className="leading-none">
          <Link
            className={cn(buttonVariants({ variant: "link" }), "size-fit p-0")}
            href={`/@${user?.username}`}
          >
            {user?.username}
          </Link>
          &nbsp;{notifDisplay.label}
        </p>

        <ItemDescription className="text-xs">{notif.groupDate}</ItemDescription>
      </ItemContent>
    </Item>
  );
};

export default NotificationCard;
