import {
  BellIcon,
  HomeIcon,
  MessageCircleIcon,
  PlusIcon,
  SearchIcon,
} from "lucide-react";
import { HiUserGroup } from "react-icons/hi2";
import { MenuItem } from "../types";
import { Button } from "@/components/ui/button";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useTranslation } from "react-i18next";
import { usePostFormDialog } from "@/features/posts/hooks/use-post-form-dialog";
import { useRouter } from "next/navigation";
import CreatePostButton from "@/features/posts/components/create-post-button";
import { useNotificationSheet } from "@/features/notifications/hooks/use-notification-sheet";

const SidebarContent = () => {
  const { t } = useTranslation();
  const { onOpen: openNotifications } = useNotificationSheet();
  const router = useRouter();
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
    },
    {
      id: "notifications",
      label: t("sidebar:notificationsMenu"),
      icon: BellIcon,
      action: () => openNotifications(),
    },
  ];
  return (
    <div className="space-y-2 pt-4">
      {items.map((item) => (
        <div
          className="flex flex-row w-full gap-4 items-center justify-start px-4 py-2 cursor-pointer hover:bg-accent hover:text-accent-foreground"
          key={item.id}
          onClick={() => {
            if (item.action) {
              item.action();
            }
          }}
        >
          {item.icon && <item.icon className="size-4" />}
          <p className="  font-semibold">{item.label}</p>
        </div>
      ))}
      <div className="px-8 py-4">
        <CreatePostButton className="w-full" />
      </div>
    </div>
  );
};

export default SidebarContent;
