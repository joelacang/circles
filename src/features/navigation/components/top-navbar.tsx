import NotificationDropdown from "@/features/notifications/components/notification-dropdown";
import UserAvatar from "@/features/users/components/user-avatar";
import UserMenu from "@/features/users/components/user-menu";

const TopNavbar = () => {
  return (
    <nav className="w-full flex items-center justify-between">
      <p className="text-2xl text-primary font-black">circles</p>
      <div className="flex flex-row items-center justify-end gap-2">
        <NotificationDropdown />
        <UserMenu mode="avatar" />
      </div>
    </nav>
  );
};

export default TopNavbar;
