import UserMenu from "@/features/users/components/user-menu";
import { useClerk, useUser } from "@clerk/nextjs";

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
      <UserMenu mode="default" />
    </div>
  );
};

export default SidebarFooter;
