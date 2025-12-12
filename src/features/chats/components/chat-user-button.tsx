import Hint from "@/components/hint";
import { Button } from "@/components/ui/button";
import { UserPreview } from "@/features/users/types";
import { MessageCircle } from "lucide-react";
import { useAddNewMessageDialog } from "../hooks/use-add-message-dialog";

interface Props {
  user: UserPreview;
}
const ChatUserButton = ({ user }: Props) => {
  const { onOpenWithRecipients } = useAddNewMessageDialog();
  return (
    <Hint tooltip={`Message @${user.username}`}>
      <Button
        className="rounded-full size-fit p-2.5 border-primary"
        size="icon"
        variant="outline"
        onClick={() => onOpenWithRecipients([user], false)}
      >
        <MessageCircle className="size-5 text-primary" />
      </Button>
    </Hint>
  );
};

export default ChatUserButton;
