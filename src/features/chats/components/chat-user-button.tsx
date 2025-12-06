import Hint from "@/components/hint";
import { Button } from "@/components/ui/button";
import { UserPreview } from "@/features/users/types";
import { useMutation } from "convex/react";
import { MessageCircle } from "lucide-react";
import { api } from "../../../../convex/_generated/api";
import { useConvexMutationHandler } from "@/hooks/use-convex-mutation-handler";
import { useChatBar } from "../hooks/use-chat-bar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import ToastMessage from "@/components/toast-message";
import { MODE } from "@/types/enum";
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
