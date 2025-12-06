import { GroupedMessages } from "../types";
import SameDayMessages from "./same-day-messages";

interface Props {
  group: GroupedMessages;
}
const ChatMessagesByDate = ({ group }: Props) => {
  const { date, messages } = group;

  return (
    <div>
      <div className=" py-12 w-full flex items-center justify-center">
        <div className="flex items-center gap-6 justify-center max-w-lg w-full">
          <div className="h-px w-full max-w-24 bg-border" />
          <p className="text-xs text-muted-foreground font-light">{date}</p>
          <div className="h-px w-full max-w-24 bg-border" />
        </div>
      </div>

      <SameDayMessages messages={messages} />
    </div>
  );
};

export default ChatMessagesByDate;
