import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import UserItem from "./user-item";
import { MenuItem } from "@/features/navigation/types";
import {
  CheckCircle2Icon,
  LanguagesIcon,
  LogOutIcon,
  MoonIcon,
  SettingsIcon,
  SunIcon,
  UserIcon,
} from "lucide-react";
import { useClerk } from "@clerk/nextjs";
import { useProfileDialog } from "../hooks/use-profile-dialog";
import MyDropdownMenuItem from "@/components/my-dropdown-menu-item";
import { languages } from "@/i18n/resources";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import UserAvatar from "./user-avatar";
import { cn } from "@/lib/utils";
import { SIZE } from "@/types/enum";
import { useTheme } from "next-themes";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Skeleton } from "@/components/ui/skeleton";
import UserItemSkeleton from "./user-item-skeleton";

interface Props {
  mode: "default" | "avatar";
}
const UserMenu = ({ mode = "default" }: Props) => {
  const { openUserProfile, signOut } = useClerk();
  const user = useQuery(api.users.getLoggedUserQuery);
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  const items: MenuItem[] = [
    {
      id: "profile",
      label: t("users:myProfile"),
      icon: UserIcon,
      action: () => router.push("/profile"),
    },
    {
      id: "change-language",
      label: t("users:changeLanguage"),
      icon: LanguagesIcon,
      subMenus: languages.map((lang) => ({
        id: lang.code,
        label: lang.label,
        action: () => i18n.changeLanguage(lang.code),
        children: currentLanguage === lang.code && (
          <div>
            <CheckCircle2Icon className="text-green-500" />
          </div>
        ),
      })),
    },
    {
      id: "set-to-light-mode",
      label: t("users:setLightMode"),
      icon: SunIcon,
      hidden: theme === "light",
      action: () => setTheme("light"),
    },
    {
      id: "set-to-dark-mode",
      label: t("users:setDarkMode"),
      icon: MoonIcon,
      hidden: theme === "dark",
      action: () => setTheme("dark"),
    },
    {
      id: "manage-account",
      label: t("users:manageAccount"),
      icon: SettingsIcon,
      withSeparator: true,
      action: () => openUserProfile(),
    },
    {
      id: "sign-out",
      label: t("users:signOut"),
      icon: LogOutIcon,
      action: () => signOut(),
    },
  ];

  if (user === undefined) {
    return (
      <div className="w-full">
        {mode === "default" ? (
          <UserItemSkeleton />
        ) : (
          <Skeleton className="size-8 rounded-full" />
        )}
      </div>
    );
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          " cursor-pointer",
          mode === "default" ? "w-full" : "w-fit"
        )}
      >
        {user && (
          <>
            {mode === "default" ? (
              <UserItem
                variant="outline"
                subtitle={`@${user.username}`}
                user={user}
              />
            ) : (
              <UserAvatar imageUrl={user.imageUrl} size={SIZE.MICRO} />
            )}
          </>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-72 mx-4 z-[70]">
        <DropdownMenuGroup>
          {user && <UserItem user={user} subtitle={`@${user.username}`} />}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {items.map((item) => (
            <MyDropdownMenuItem key={item.id} item={item} />
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
