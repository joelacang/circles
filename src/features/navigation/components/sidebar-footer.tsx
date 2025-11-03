import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import UserItem from "@/features/users/components/user-item";
import UserMenu from "@/features/users/components/user-menu";
import { useClerk, UserButton, useUser } from "@clerk/nextjs";
import { ChevronUp } from "lucide-react";

const SidebarFooter = () => {
  const { user } = useUser();
  const {} = useClerk();

  if (!user) {
    return (
      <div>
        <p>User is not signed in.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <UserMenu />
    </div>
  );
};

export default SidebarFooter;
