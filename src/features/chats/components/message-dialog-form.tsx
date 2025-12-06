import UserSelector from "@/features/users/components/user-selector";
import { useAddNewMessageDialog } from "../hooks/use-add-message-dialog";
import InputTextareaGroup from "@/components/input-textarea-group";
import MessagePreviewCard from "./message-preview-card";
import UserBadge from "@/features/users/components/user-badge";
import { Label } from "@radix-ui/react-label";
import { cn } from "@/lib/utils";

const MessageDialogForm = () => {
  const {
    draft,
    onEditBody,
    message,
    pending,
    onChangeRecipients,
    searchUsers,
  } = useAddNewMessageDialog();

  if (!draft) return null;

  const { body, recipients, id } = draft;
  return (
    <div className="space-y-4 w-full">
      <div
        className={cn(
          "flex gap-2",
          searchUsers ? "flex-col" : "flex-row items-center"
        )}
      >
        <Label className=" font-semibold text-sm">
          To:&nbsp;
          {recipients.length > 0 && searchUsers && (
            <span className="text-primary font-semibold">
              (
              {`${recipients.length} recipient${recipients.length > 1 ? "s" : ""}`}
              )
            </span>
          )}
        </Label>
        {searchUsers ? (
          <UserSelector
            initialUsers={recipients ?? []}
            onChangeUserSelection={onChangeRecipients}
          />
        ) : (
          <>
            {draft && draft.recipients.length > 0 && (
              <div className="flex flex-row flex-wrap">
                {recipients.map((recipient) => (
                  <div className="w-fit" key={recipient.id}>
                    <UserBadge user={recipient} />
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <InputTextareaGroup
        topAddon={
          message &&
          message.authorId && (
            <MessagePreviewCard message={message} authorId={message.authorId} />
          )
        }
        value={body ?? ""}
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
