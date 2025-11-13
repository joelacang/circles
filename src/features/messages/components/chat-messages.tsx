import ChatMessage from "./chat-message";

const ChatMessages = () => {
  return (
    <div className="flex flex-col w-full">
      <ChatMessage mode="sender" messageType="first" />
      <ChatMessage mode="sender" messageType="last" />
      <ChatMessage mode="receiver" messageType="first" hasReply />
      <ChatMessage mode="receiver" messageType="middle" hasReply />
      <ChatMessage mode="receiver" messageType="last" />
      <ChatMessage mode="sender" messageType="none" />
      <ChatMessage mode="receiver" messageType="first" />
      <ChatMessage mode="receiver" messageType="last" />
    </div>
  );
};

export default ChatMessages;
