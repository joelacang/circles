import {
  BellIcon,
  HomeIcon,
  MessageCircleIcon,
  SearchIcon,
} from "lucide-react";
import { HiUserGroup } from "react-icons/hi2";
import { MenuItem } from "../types";
import { useTranslation } from "react-i18next";
import { usePathname, useRouter } from "next/navigation";
import CreatePostButton from "@/features/posts/components/create-post-button";
import { useNotificationSheet } from "@/features/notifications/hooks/use-notification-sheet";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useSearchSheet } from "@/features/search/hooks/use-search-sheet";
import { bg } from "zod/v4/locales";
import { bgGradientPrimary } from "@/lib/get-values";
import UnreadBadge from "@/components/unread-badge";

const SidebarContent = () => {
  const { t } = useTranslation();
  const { onOpen: openNotifications, open: notifSheetOpen } =
    useNotificationSheet();
  const { onOpen: openSearch, open: searchSheetOpen } = useSearchSheet();
  const router = useRouter();
  const unreadNotifs = useQuery(api.notifications.getUnreadNotifCount);
  const unreadMsgs = useQuery(api.messages.getUnreadMessagesCount);
  const pathname = usePathname();
  const isSheetOpen = notifSheetOpen || searchSheetOpen;

  const items: MenuItem[] = [
    {
      id: "home",
      label: t("sidebar:homeMenu"),
      icon: HomeIcon,
      action: () => router.push(`/`),
      highlighted: pathname === "/" && !isSheetOpen,
    },
    {
      id: "search",
      label: t("sidebar:searchMenu"),
      icon: SearchIcon,
      action: () => openSearch(),
      highlighted: searchSheetOpen,
    },
    {
      id: "circles",
      label: t("sidebar:circlesMenu"),
      icon: HiUserGroup,
    },
    {
      id: "messages",
      label: t("sidebar:messagesMenu"),
      icon: MessageCircleIcon,
      action: () => router.push(`/messages`),
      highlighted: pathname.startsWith("/messages") && !isSheetOpen,
      count: unreadMsgs ?? 0,
    },
    {
      id: "notifications",
      label: t("sidebar:notificationsMenu"),
      icon: BellIcon,
      action: () => openNotifications(unreadNotifs ?? 0),
      count: unreadNotifs ?? 0,
      highlighted: notifSheetOpen,
    },
  ];
  return (
    <div className="space-y-2 pt-4">
      {items.map((item) => (
        <div
          className="flex flex-row w-full gap-4 items-center justify-between px-4 py-2.5 cursor-pointer hover:bg-accent hover:text-accent-foreground"
          key={item.id}
          onClick={() => {
            if (item.action) {
              item.action();
            }
          }}
        >
          <div className="flex flex-row gap-4 items-center justify-start">
            {item.icon && (
              <item.icon
                className={cn("size-4", item.highlighted && "text-primary")}
              />
            )}
            <p
              className={cn(
                " text-lg font-semibold",
                item.highlighted && "text-primary"
              )}
            >
              {item.label}
            </p>
          </div>

          {item.count && item.count > 0 ? (
            <UnreadBadge count={item.count} />
          ) : null}
        </div>
      ))}
      <div className="px-8 py-4">
        <CreatePostButton className="w-full" />
      </div>
    </div>
  );
};

export default SidebarContent;
