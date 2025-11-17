import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import ErrorMessage from "@/components/error-message";
import { SearchX } from "lucide-react";
import ChatRoomSection from "./chat-room-section";

interface Props {
  chatId: Id<"chats">;
}
const ChatLoader = ({ chatId }: Props) => {
  const chat = useQuery(api.chats.getChat, { chatId });

  if (chat === undefined) {
    return <div>Loading</div>;
  }

  if (chat === null) {
    return <ErrorMessage icon={SearchX} message="Chat Not Found" />;
  }
  return (
    <div className="w-full">
      <ChatRoomSection chat={chat} />
    </div>
  );
};

export default ChatLoader;
