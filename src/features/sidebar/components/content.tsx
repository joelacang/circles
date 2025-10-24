import {
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

const SidebarContent = () => {
  const { t } = useTranslation();
  const { onOpen } = usePostFormDialog();
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
        <Button className="w-full" onClick={onOpen}>
          <PlusIcon />
          <span>{t("sidebar:createPost")}</span>
        </Button>
      </div>
    </div>
  );
};

export default SidebarContent;
