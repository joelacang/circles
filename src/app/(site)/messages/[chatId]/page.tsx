"use client";

import InfoMessage from "@/components/info-message";
import ChatLoader from "@/features/chats/components/chat-loader";
import { useParams } from "next/navigation";
import { Id } from "../../../../../convex/_generated/dataModel";

const ChatRoomPage = () => {
  const params = useParams();
  const chatId = params.chatId;

  if (!chatId) {
    return (
      <InfoMessage
        imageUrl="/images/not-found.png"
        message="No chatId found."
      />
    );
  }

  return <ChatLoader chatId={chatId as Id<"chats">} />;
};

export default ChatRoomPage;
