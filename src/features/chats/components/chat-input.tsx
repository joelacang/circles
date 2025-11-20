import Hint from "@/components/hint";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import {
  Loader2,
  Paperclip,
  Reply,
  Send,
  Smile,
  TriangleAlert,
} from "lucide-react";
import { Id } from "../../../../convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useConvexMutationHandler } from "@/hooks/use-convex-mutation-handler";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import ToastMessage from "@/components/toast-message";
import { MODE } from "@/types/enum";
import EmojiPicker from "@/components/emoji-picker";
import { Emoji } from "../types";
import { useInsertToText } from "@/hooks/use-insert-text";
import { useAddNewMessageDialog } from "../hooks/use-add-message-dialog";
import MessagePreviewCard from "./message-preview-card";
import { useIsMobile } from "@/hooks/use-mobile";

interface Props {
  chatId: Id<"chats">;
}
const ChatInput = ({ chatId }: Props) => {
  const sendMessageFn = useMutation(api.messages.sendChatMessage);
  const { mutate: sendMessage, isLoading } =
    useConvexMutationHandler(sendMessageFn);
  const [body, setBody] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const insertToText = useInsertToText(body, setBody, inputRef);
  const { messageToReply, onRemoveReply } = useAddNewMessageDialog();

  const handleSendMessage = () => {
    sendMessage(
      { chatId, body },
      {
        onSuccess: () => {
          setBody("");
        },
        onError: (error) => {
          toast.custom(() => (
            <ToastMessage
              mode={MODE.ERROR}
              message="Error sending your message."
              description={error}
              icon={TriangleAlert}
            />
          ));
        },
      }
    );
  };

  const handleSelectEmoji = (emoji: Emoji) => {
    insertToText(emoji.native);
  };

  return (
    <div className="relative">
      {messageToReply && messageToReply.authorId && (

        <div className="absolute bottom-full w-full pb-4 px-4">
          <MessagePreviewCard
            message={messageToReply}
            authorId={messageToReply.authorId}
            title="Reply To:"
            icon={Reply}
            removable
            onClose={onRemoveReply}
            minimized
          />
        </div>
      )}

      <InputGroup>
        <InputGroupAddon align="inline-start">
          <Hint tooltip="Attach Files">
            <Button
              variant="outline"
              className="rounded-full border-primary"
              size="icon"
              disabled={isLoading}
            >
              <Paperclip className="size-4 text-primary" />
            </Button>
          </Hint>

          <EmojiPicker onSelectEmoji={handleSelectEmoji}>
            <Button
              variant="outline"
              className="rounded-full border-primary"
              size="icon"
              disabled={isLoading}
            >
              <Smile />
            </Button>
          </EmojiPicker>
        </InputGroupAddon>
        <InputGroupTextarea
          ref={inputRef}
          className="w-full min-h-16 max-h-16"
          placeholder="Enter your message here"
          value={body}
          onChange={(e) => setBody(e.currentTarget.value)}
        />
        <InputGroupAddon align="inline-end">
          <Hint tooltip="Send Message">
            <Button
              className="rounded-full"
              size="icon"
              disabled={isLoading || body.length < 1}
              onClick={handleSendMessage}
            >
              {isLoading ? <Loader2 className="animate-spin" /> : <Send />}
            </Button>
          </Hint>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
};

export default ChatInput;
