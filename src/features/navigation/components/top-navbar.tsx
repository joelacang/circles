import NotificationNavbarButton from "@/features/notifications/components/notification-navbar-button";
import SearchNavbarButton from "@/features/search/components/search-navbar-button";
import UserMenu from "@/features/users/components/user-menu";

const TopNavbar = () => {
  return (
    <nav className="w-full flex items-center justify-between">
      <p className="text-2xl text-primary font-black">circles</p>
      <div className="flex flex-row items-center justify-end gap-1 ">
        <SearchNavbarButton />
        <NotificationNavbarButton />
        <UserMenu mode="avatar" />
      </div>
    </nav>
  );
};

export default TopNavbar;
