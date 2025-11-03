import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import UserItem from "./user-item";
import { MenuItem } from "@/features/navigation/types";
import {
  CheckCircle2Icon,
  CheckCircleIcon,
  LanguagesIcon,
  LogOutIcon,
  MoonIcon,
  SettingsIcon,
  SunIcon,
  UserIcon,
  Wifi,
  XIcon,
} from "lucide-react";
import { useClerk, useUser } from "@clerk/nextjs";
import { useProfileDialog } from "../hooks/use-profile-dialog";
import MyDropdownMenuItem from "@/components/my-dropdown-menu-item";
import { languages } from "@/i18n/resources";
import i18n from "@/i18n";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import UserAvatar from "./user-avatar";
import { cn } from "@/lib/utils";
import { SIZE } from "@/types/enum";
import { useTheme } from "next-themes";

interface Props {
  mode: "default" | "avatar";
}
const UserMenu = ({ mode = "default" }: Props) => {
  const { openUserProfile, signOut } = useClerk();
  const { user } = useUser();
  const { t, i18n } = useTranslation();
  const { onOpen } = useProfileDialog();
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
                subtitle={user?.username ? `@${user.username}` : ""}
                user={{
                  id: user.id,
                  firstName: user.firstName,
                  lastName: user.lastName,
                  username: user.username,
                  imageUrl: user.imageUrl,
                }}
              />
            ) : (
              <UserAvatar imageUrl={user.imageUrl} size={SIZE.MICRO} />
            )}
          </>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-72 mx-4 z-[70]">
        <DropdownMenuGroup>
          {user && (
            <UserItem
              user={{
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
                imageUrl: user.imageUrl,
              }}
              subtitle={user?.username ? `@${user.username}` : ""}
            />
          )}
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
