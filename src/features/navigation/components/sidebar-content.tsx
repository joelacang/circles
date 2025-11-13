import {
  BellIcon,
  HomeIcon,
  MessageCircleIcon,
  SearchIcon,
} from "lucide-react";
import { HiUserGroup } from "react-icons/hi2";
import { MenuItem } from "../types";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import CreatePostButton from "@/features/posts/components/create-post-button";
import { useNotificationSheet } from "@/features/notifications/hooks/use-notification-sheet";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

const SidebarContent = () => {
  const { t } = useTranslation();
  const { onOpen: openNotifications } = useNotificationSheet();
  const router = useRouter();
  const unread = useQuery(api.notifications.getUnreadNotifCount);

  const items: MenuItem[] = [
    {
      id: "home",
      label: t("sidebar:homeMenu"),
      icon: HomeIcon,
      action: () => router.push(`/`),
    },
    {
      id: "search",
      label: t("sidebar:searchMenu"),
      icon: SearchIcon,
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
    },
    {
      id: "notifications",
      label: t("sidebar:notificationsMenu"),
      icon: BellIcon,
      action: () => openNotifications(unread ?? 0),
      count: unread ?? 0,
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
            {item.icon && <item.icon className="size-4" />}
            <p className=" text-lg font-semibold">{item.label}</p>
          </div>

          {item.count && item.count > 0 ? (
            <div className="bg-blue-500 min-w-6 flex items-center justify-center p-1 rounded-full leading-none size-fit">
              <p className="text-xs font-semibold text-primary-foreground">
                {item.count}
              </p>
            </div>
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
