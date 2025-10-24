import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SIZE } from "../../../types/enum";
import { cn } from "@/lib/utils";
import { getAvatarSize, getAvatarTextSize } from "@/lib/get-values";

interface Props {
  imageUrl?: string | null;
  size?: SIZE;
  fallback?: string;
  className?: string;
}

const UserAvatar = ({
  imageUrl,
  size = SIZE.DEFAULT,
  fallback,
  className,
}: Props) => {
  return (
    <Avatar className={cn(getAvatarSize(size), className)}>
      <AvatarImage
        src={imageUrl ?? "/images/avatar-placeholder.jpg"}
        className="object-cover"
      />
      {fallback && (
        <AvatarFallback
          className={cn(
            getAvatarTextSize(size),
            "font-semibold bg-gradient-to-br text-white from-violet-200 via-primary to-purple-700"
          )}
        >
          {fallback.charAt(0).toUpperCase()}
        </AvatarFallback>
      )}
    </Avatar>
  );
};

export default UserAvatar;
