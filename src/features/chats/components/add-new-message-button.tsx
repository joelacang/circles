import Hint from "@/components/hint";
import { Button } from "@/components/ui/button";
import { MailPlus } from "lucide-react";
import { useAddNewMessageDialog } from "../hooks/use-add-message-dialog";

const AddNewMessageButton = () => {
  const { onOpen } = useAddNewMessageDialog();
  return (
    <Hint tooltip="Add New Message">
      <Button
        variant="ghost"
        className="rounded-full"
        size="icon"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onOpen();
        }}
      >
        <MailPlus className="size-5 text-primary" />
      </Button>
    </Hint>
  );
};

export default AddNewMessageButton;
