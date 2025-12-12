import { useChat } from "../../../providers/chat-provider";
import ChatRoomSection from "./chat-room-section";

const ChatFloatingRoom = () => {
  const { chat } = useChat();
  const newLocal = (
    <div className="h-[calc(60vh-80px)]">
      <ChatRoomSection chat={chat} />
    </div>
  );
  return newLocal;
};

export default ChatFloatingRoom;
