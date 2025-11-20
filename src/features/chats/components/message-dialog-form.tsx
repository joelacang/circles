import UserSelector from "@/features/users/components/user-selector";
import { useAddNewMessageDialog } from "../hooks/use-add-message-dialog";
import InputTextareaGroup from "@/components/input-textarea-group";
import MessagePreviewCard from "./message-preview-card";

const MessageDialogForm = () => {
  const { draft, onEditBody, message, pending, onChangeRecipients } =
    useAddNewMessageDialog();

  return (
    <div className="space-y-4 w-full">
      <UserSelector onChangeUserSelection={onChangeRecipients} />
      <InputTextareaGroup
        topAddon={
          message &&
          message.authorId && (
            <MessagePreviewCard message={message} authorId={message.authorId} />
          )
        }
        value={draft?.body ?? ""}
        onChangeValue={onEditBody}
        attachFile
        emojiPicker
        clearButton
        placeholder="Enter your message"
        disabled={pending}
      />
    </div>
  );
};

export default MessageDialogForm;
