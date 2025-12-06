import Hint from "@/components/hint";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { Loader2, Reply, Send, Smile, TriangleAlert } from "lucide-react";
import { Id } from "../../../../convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useConvexMutationHandler } from "@/hooks/use-convex-mutation-handler";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import ToastMessage from "@/components/toast-message";
import { MODE } from "@/types/enum";
import EmojiPicker from "@/components/emoji-picker";
import { Emoji } from "../types";
import { useInsertToText } from "@/hooks/use-insert-text";
import MessagePreviewCard from "./message-preview-card";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useChat } from "../../../providers/chat-provider";
import AttachmentPreviewSection from "@/features/attachments/components/attachment-preview-section";
import AddAttachmentButton from "@/features/attachments/components/add-attachment-button";
import { LocalFile } from "@/features/attachments/types";
import { useUploadFiles } from "@/features/attachments/hooks/use-upload-files";
import { AttachmentDetail } from "@/types";

interface Props {
  chatId: Id<"chats">;
}
const ChatInput = ({ chatId }: Props) => {
  const sendMessageFn = useMutation(api.messages.sendChatMessage);
  const { mutate: sendMessage, isLoading: isSendingMessage } =
    useConvexMutationHandler(sendMessageFn);
  const [body, setBody] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const insertToText = useInsertToText(body, setBody, inputRef);
  const [displayReply, setDisplayReply] = useState(false);
  const [startingAnim, setStartingAnim] = useState(false);
  const pathname = usePathname();
  const { messageToReply, onRemoveReply } = useChat();
  const [files, setFiles] = useState<LocalFile[]>([]);
  const { uploadFiles, uploading, error: uploadError } = useUploadFiles();
  const isLoading = uploading || isSendingMessage;

  const handleSelectFiles = (selectedFiles: File[]) => {
    const updatedLocalFiles: LocalFile[] = selectedFiles.map((f) => ({
      file: f,
      url: URL.createObjectURL(f),
    }));

    setFiles((prev) => [...prev, ...updatedLocalFiles]);
  };

  const handleFilesChange = (updatedFiles: LocalFile[]) => {
    setFiles(updatedFiles);
  };

  const handleSendMessage = async () => {
    let attachments: AttachmentDetail[] = [];

    if (files.length > 0) {
      toast.custom(
        () => <ToastMessage mode={MODE.LOADING} message="Uploading Files..." />,
        { id: "uploading-files-toast" }
      );

      const filesToBeUploaded = files.map((f) => f.file);

      const { success, attachments: uploadedAttachments } =
        await uploadFiles(filesToBeUploaded);

      toast.dismiss("uploading-files-toast");

      if (!success) {
        if (uploadError) {
          toast.custom(() => (
            <ToastMessage
              message="Error uploading files"
              description={uploadError}
              mode={MODE.ERROR}
            />
          ));
        }

        return;
      }

      attachments = uploadedAttachments;
    }

    sendMessage(
      {
        chatId,
        body,
        parentMessageId: messageToReply?.id,
        attachments,
      },
      {
        onSuccess: () => {
          setBody("");
          handleClose();
          setFiles([]);
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

  const handleOpenReply = () => {
    setStartingAnim(true);
    setTimeout(() => {
      setStartingAnim(false);
      setDisplayReply(true);
    }, 200);
  };

  const handleClose = () => {
    setStartingAnim(true);

    setTimeout(() => {
      onRemoveReply();
      setStartingAnim(false);
    }, 500);
  };

  useEffect(() => {
    handleOpenReply();
  }, [messageToReply]);

  useEffect(() => {
    onRemoveReply();
  }, [pathname]);

  return (
    <div className="relative">
      <div className={cn("absolute bottom-full w-full pb-4 px-4 space-y-2 ")}>
        <div
          className={cn(
            "transition-all duration-500 ease-in-out",
            displayReply && !startingAnim
              ? "translate-y-0 "
              : "translate-y-full  pointer-events-none"
          )}
        >
          {messageToReply && messageToReply.authorId && (
            <MessagePreviewCard
              message={messageToReply}
              authorId={messageToReply.authorId}
              title="Reply To:"
              icon={Reply}
              removable
              onClose={handleClose}
              minimized
              disabled={isLoading}
            />
          )}
        </div>
        {files.length > 0 && (
          <div className="bg-muted shadow-lg border-dashed border rounded-xl">
            <AttachmentPreviewSection
              files={files}
              onFilesChanged={handleFilesChange}
            />
          </div>
        )}
      </div>

      <InputGroup>
        <InputGroupAddon align="inline-start">
          <AddAttachmentButton
            className="rounded-full"
            variant="outline"
            onFilesSelected={handleSelectFiles}
            multiple
            disabled={isLoading}
          />
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
          disabled={isLoading}
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
