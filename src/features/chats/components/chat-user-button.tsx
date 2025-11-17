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

interface Props {
  user: UserPreview;
}
const ChatUserButton = ({ user }: Props) => {
  const getDirectChatFn = useMutation(api.chats.getDirectChat);
  const { mutate: getChat, isLoading: isGettingChat } =
    useConvexMutationHandler(getDirectChatFn);
  const { onOpenChat } = useChatBar();
  const isMobile = useIsMobile();
  const router = useRouter();

  const onGetDirectChat = () => {
    if (!isMobile) {
      getChat(
        { participantId: user.id },
        {
          onSuccess: (response) => {
            if (response) {
              onOpenChat(response);
            } else {
              toast.custom(() => (
                <ToastMessage message="Chat Room Not Found" mode={MODE.ERROR} />
              ));
            }
          },
          onError: (error) => {
            toast.custom(() => (
              <ToastMessage
                message="Error Loading Chat"
                description={error}
                mode={MODE.ERROR}
              />
            ));
          },
        }
      );
    } else {
      router.push(`/messages/kals34sdafads`);
    }
  };
  return (
    <Hint tooltip={`Message @${user.username}`}>
      <Button
        className="rounded-full size-fit p-2.5 border-primary"
        size="icon"
        variant="outline"
        disabled={isGettingChat}
        onClick={onGetDirectChat}
      >
        <MessageCircle className="size-5 text-primary" />
      </Button>
    </Hint>
  );
};

export default ChatUserButton;
