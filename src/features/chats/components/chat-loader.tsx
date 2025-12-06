import ChatRoomSection from "./chat-room-section";
import ChatHeader from "./chat-header";
import { useChat } from "../../../providers/chat-provider";

const ChatLoader = () => {
  const { chat } = useChat();

  return (
    <div className="w-full">
      <div className="w-full border-b">
        <ChatHeader chat={chat} />
      </div>
      <div className="h-[calc(100vh-212px)] @5xl:h-[calc(100vh-192px)] ">
        <ChatRoomSection chat={chat} />
      </div>
    </div>
  );
};

export default ChatLoader;
