import Hint from "@/components/hint";
import { cn } from "@/lib/utils";
import { Message } from "../types";
import ReactionButton from "./reaction-button";
import MessageDropdownMenu from "./messge-dropdown-menu";

interface Props {
  isSender?: boolean;
  message: Message;
}
const MessageOptions = ({ isSender, message }: Props) => {
  return (
    <div
      className={cn(
        "items-center flex ",
        isSender ? "flex-row-reverse" : "flex-row"
      )}
    >
      <Hint tooltip="React To Message">
        <div>
          <ReactionButton messageId={message.id} />
        </div>
      </Hint>

      <Hint tooltip="Message Options">
        <div>
          <MessageDropdownMenu message={message} />
        </div>
      </Hint>
    </div>
  );
};

export default MessageOptions;
