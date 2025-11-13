import { Notification } from "../types";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { useTranslation } from "react-i18next";
import { getNotificationDisplay } from "../utils";
import { cn } from "@/lib/utils";
import React from "react";

import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import UserAvatar from "@/features/users/components/user-avatar";
import { buttonVariants } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { SIZE } from "@/types/enum";
import { useConvexMutationHandler } from "@/hooks/use-convex-mutation-handler";
import { api } from "../../../../convex/_generated/api";
import { useMutation } from "convex/react";

interface Props {
  notif: Notification;
}

const NotificationCard = ({ notif }: Props) => {
  const readNotifFn = useMutation(api.notifications.read);
  const { mutate: readNotif, isLoading: isReadingNotification } =
    useConvexMutationHandler(readNotifFn);
  const { t } = useTranslation();
  const notifDisplay = getNotificationDisplay({
    action: notif.action,
    mode: notif.postId ? "post" : "comment",
  });

  const router = useRouter();

  return (
    <Item
      className={cn(
        "hover:bg-accent cursor-pointer  px-2 pt-2 pb-4",
        !notif.readTime && "bg-primary/10"
      )}
      onClick={() => {
        if (
          notif.action === "comment" ||
          notif.action === "like" ||
          notif.action === "mention" ||
          notif.action === "quote"
        ) {
          if (notif.postId) {
            router.push(`/posts/${notif.postId}`);
          }
        }

        if (notif.action === "follow") {
          if (notif.senders.details.length > 0) {
            router.push(`/@${notif.senders.details[0].user.username}`);
          }
        }

        if (!notif.readTime) {
          readNotif({ notifRecipientId: notif.recipientId });
        }
      }}
    >
      <ItemMedia className="relative">
        {notif.senders.details[0] && (
          <UserAvatar
            imageUrl={
              notif.senders.details[0]?.user.imageUrl ??
              "/images/avatar-placeholder.png"
            }
            size={SIZE.SMALL}
          />
        )}

        <div
          className={cn(
            "absolute -bottom-1 -right-1 size-fit p-1 shadow-md  rounded-full bg-gradient-to-br from-[_var(--col-light)] to-[_var(--col-dark)]"
          )}
          style={
            {
              "--col-dark": notifDisplay.darkColor,
              "--col-primary": notifDisplay.primaryColor,
              "--col-light": notifDisplay.lightColor,
            } as React.CSSProperties
          }
        >
          <notifDisplay.icon className="size-3 text-white" />
        </div>
      </ItemMedia>
      <ItemContent>
        <ItemTitle>
          <p>
            {notif.senders.details.map((s, index) => {
              const isLast = index === notif.senders.details.length - 1;
              const isSecondLast = index === notif.senders.details.length - 2;
              const hasRemaining = notif.senders.remaining > 0;

              if (isLast && hasRemaining) {
                return (
                  <span key="others">
                    {` and ${notif.senders.remaining} others `}
                  </span>
                );
              }

              return (
                <span key={s.user.id}>
                  <Link
                    href={`/@${s.user.username}`}
                    className={cn(
                      buttonVariants({ variant: "link" }),
                      "size-fit p-0"
                    )}
                  >
                    {s.user.name}
                  </Link>
                  {!isLast && (isSecondLast && !hasRemaining ? " and " : ", ")}
                </span>
              );
            })}
            <span>{` ${notifDisplay.label}`}</span>
          </p>
        </ItemTitle>
        <ItemDescription className="text-xs">{notif.groupDate}</ItemDescription>
      </ItemContent>
      <ItemActions>
        {!notif.readTime && <div className="size-2 rounded-full bg-primary" />}
      </ItemActions>
    </Item>
  );
};

export default NotificationCard;
