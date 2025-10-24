import Hint from "@/components/hint";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { PlusIcon, SendIcon } from "lucide-react";

const CommentBox = () => {
  return (
    <div className="p-3">
      <InputGroup>
        <InputGroupTextarea
          placeholder="Write your comment..."
          className="min-h-8 max-h-24"
        />
        <InputGroupAddon align="inline-start">
          <Hint tooltip="Attach Image">
            <Button size="sm" variant="ghost" className="rounded-full">
              <PlusIcon />
            </Button>
          </Hint>
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">
          <Hint tooltip="Submit Comment">
            <Button size="sm" variant="ghost" className="rounded-full">
              <SendIcon />
            </Button>
          </Hint>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
};

export default CommentBox;
