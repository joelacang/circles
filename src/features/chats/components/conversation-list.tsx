import ConversationCard from "./conversation-card";
import { ChatDetail } from "../types";
import { useParams } from "next/navigation";

interface Props {
  chats: ChatDetail[];
}
const ConversationList = ({ chats }: Props) => {
  const params = useParams();
  const chatIdParams = params.chatId;

  return (
    <div className="w-full space-y-1">
      {chats.map((chat) => (
        <ConversationCard
          key={chat.chat.id}
          chat={chat}
          selected={chat.chat.id === chatIdParams}
        />
      ))}
    </div>
  );
};

export default ConversationList;
