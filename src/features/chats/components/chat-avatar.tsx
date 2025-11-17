import UserAvatar from "@/features/users/components/user-avatar";
import { ChatDetail } from "../types";
import { SIZE } from "@/types/enum";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

interface Props {
  chat: ChatDetail;
  showBadge?: boolean;
}
const ChatAvatar = ({ chat, showBadge = false }: Props) => {
  return (
    <div className="relative">
      {chat.type === "direct" && (
        <UserAvatar
          imageUrl={
            chat.type === "direct"
              ? chat.participant.imageUrl
              : "/images/avatar-placeholder.png"
          }
          size={SIZE.SMALL}
          className="border border-white bg-gray-300"
        />
      )}
      {chat.type === "custom" && (
        <div className="size-10 relative aspect-square rounded-md bg-gray-300">
          <Image
            src="/images/group-message.png"
            alt="Group Message"
            fill
            className="object-contain"
          />
        </div>
      )}
      {chat.chat.unreadCount > 0 && showBadge && (
        <div className="absolute -top-2 -right-2">
          <Badge className=" rounded-full bg-gradient-to-br from-rose-400 to-rose-600 text-xs font-semibold z-20">
            {chat.chat.unreadCount}
          </Badge>
        </div>
      )}
    </div>
  );
};

export default ChatAvatar;
