import UserAvatar from "@/features/users/components/user-avatar";
import { SIZE } from "@/types/enum";

const SitePage = () => {
  return (
    <div>
      <p>This is just the home page.</p>
      <div className="flex gap-4 items-center justify-start">
        <UserAvatar size={SIZE.MICRO} fallback="M" />
        <UserAvatar size={SIZE.SMALL} fallback="S" />
        <UserAvatar size={SIZE.DEFAULT} fallback="D" />
        <UserAvatar size={SIZE.LARGE} fallback="L" />
        <UserAvatar size={SIZE.XLARGE} fallback="X" />
      </div>
    </div>
  );
};

export default SitePage;
