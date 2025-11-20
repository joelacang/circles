import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Message } from "../types";
import { Button } from "@/components/ui/button";
import { Copy, Flag, Forward, MoreHorizontal, Reply, X } from "lucide-react";
import { MenuItem } from "@/features/navigation/types";
import MyDropdownMenuItem from "@/components/my-dropdown-menu-item";
import { useLoggedUser } from "@/features/users/hooks/use-logged-user";
import { useAddNewMessageDialog } from "../hooks/use-add-message-dialog";

interface Props {
  message: Message;
}
const MessageDropdownMenu = ({ message }: Props) => {
  const { loggedUser } = useLoggedUser();
  const { onOpenForwardMsg, onReplyMessage } = useAddNewMessageDialog();
  const items: MenuItem[] = [
    {
      id: "copy",
      label: "Copy",
      icon: Copy,
    },
    {
      id: "reply",
      label: "Reply",
      icon: Reply,
      action: () => onReplyMessage(message),
    },
    {
      id: "forward",
      label: "Forward",
      icon: Forward,
      withSeparator: true,
      action: () => onOpenForwardMsg(message),
    },
    {
      id: "report",
      label: "Report",
      icon: Flag,
      hidden: message.authorId === loggedUser?.id,
    },
    {
      id: "delete",
      label: "Delete",
      icon: X,
      hidden: message.authorId !== loggedUser?.id,
    },
  ];
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="rounded-full" size="icon" variant="ghost">
          <MoreHorizontal className="text-primary" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-44">
        {items.map((item) => (
          <MyDropdownMenuItem key={item.id} item={item} />
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MessageDropdownMenu;
