import UserAvatar from "@/features/users/components/user-avatar";
import UserMenu from "@/features/users/components/user-menu";

const TopNavbar = () => {
  return (
    <nav className="w-full flex items-center justify-between">
      <p className="text-2xl text-primary font-black">circles</p>
      <UserMenu mode="avatar" />
    </nav>
  );
};

export default TopNavbar;
