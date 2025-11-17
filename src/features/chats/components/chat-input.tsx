import Hint from "@/components/hint";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { Paperclip, Send } from "lucide-react";

const ChatInput = () => {
  return (
    <InputGroup>
      <InputGroupAddon>
        <Hint tooltip="Attach Files">
          <Button
            variant="outline"
            className="rounded-full border-primary"
            size="icon"
          >
            <Paperclip className="size-4 text-primary" />
          </Button>
        </Hint>
      </InputGroupAddon>
      <InputGroupTextarea className="w-full" />
      <InputGroupAddon align="inline-end">
        <Hint tooltip="Send Message">
          <Button className="rounded-full" size="icon">
            <Send />
          </Button>
        </Hint>
      </InputGroupAddon>
    </InputGroup>
  );
};

export default ChatInput;
