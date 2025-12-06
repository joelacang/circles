import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Message } from "../types";
import { Button } from "@/components/ui/button";
import {
  Copy,
  Flag,
  Forward,
  MoreHorizontal,
  Reply,
  Trash,
  X,
} from "lucide-react";
import { MenuItem } from "@/features/navigation/types";
import MyDropdownMenuItem from "@/components/my-dropdown-menu-item";
import { useLoggedUser } from "@/features/users/hooks/use-logged-user";
import { useAddNewMessageDialog } from "../hooks/use-add-message-dialog";
import { useChat } from "../../../providers/chat-provider";
import { useConfirmationAlert } from "@/features/confirm-dialog/hooks/use-confirmation-alert";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useConvexMutationHandler } from "@/hooks/use-convex-mutation-handler";

interface Props {
  message: Message;
}
const MessageDropdownMenu = ({ message }: Props) => {
  const { loggedUser } = useLoggedUser();
  const { onOpenForwardMsg } = useAddNewMessageDialog();
  const { onReplyToMessage } = useChat();
  const {
    onOpen,
    onPending: onDeleteMsgPending,
    onCompleted: onDeleteMsgCompleted,
  } = useConfirmationAlert();
  const deleteMsgFn = useMutation(api.messages.deleteMessageById);
  const { mutate: deleteMsg, isLoading: deleteMsgLoading } =
    useConvexMutationHandler(deleteMsgFn);
  const isPending = deleteMsgLoading;

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
      action: () => onReplyToMessage(message),
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
      action: () =>
        onOpen({
          title: "Are you sure?",
          message:
            "Are you sure you want to delete this message? This action is not revershible?",
          icon: Trash,
          mode: "destructive",
          actionLabel: "Delete Message",
          enableConfirmation: false,
          action: () => {
            deleteMsg(
              { messageId: message.id },
              {
                onLoading: () => {
                  onDeleteMsgPending();
                },
                onSettled: () => {
                  onDeleteMsgCompleted();
                },
              }
            );
          },
        }),
    },
  ];
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="rounded-full"
          size="icon"
          variant="ghost"
          disabled={isPending}
        >
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
