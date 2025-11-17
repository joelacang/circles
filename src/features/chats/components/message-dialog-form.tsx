import Hint from "@/components/hint";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import UserSelector from "@/features/users/components/user-selector";
import { Eraser, Paperclip, Smile } from "lucide-react";
import { useAddNewMessageDialog } from "../hooks/use-add-message-dialog";

const MessageDialogForm = () => {
  const { draft, onEditBody, onChangeRecipients, onClearBody } =
    useAddNewMessageDialog();

  return (
    <div className="space-y-4 w-full">
      <UserSelector onChangeUserSelection={onChangeRecipients} />

      <InputGroup>
        <InputGroupTextarea
          className="max-h-[20vh] min-h-28"
          placeholder="Enter your message..."
          value={draft?.body ?? ""}
          onChange={(e) => onEditBody(e.currentTarget.value)}
        />
        <InputGroupAddon
          className="flex flex-row items-center justify-between gap-4"
          align="block-end"
        >
          <div className="flex flex-row items-center justify-start">
            <Hint tooltip="Attach File">
              <InputGroupButton type="button">
                <Paperclip />
              </InputGroupButton>
            </Hint>
            <Hint tooltip="Add Emoji">
              <InputGroupButton type="button">
                <Smile />
              </InputGroupButton>
            </Hint>
          </div>

          {draft?.body.trim() !== "" && (
            <InputGroupButton onClick={onClearBody}>
              <Eraser />
              Clear
            </InputGroupButton>
          )}
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
};

export default MessageDialogForm;
