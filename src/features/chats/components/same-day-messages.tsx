import { useLoggedUser } from "@/features/users/hooks/use-logged-user";
import { Id } from "../../../../convex/_generated/dataModel";
import { ChatDetail, Message } from "../types";
import ChatMessage from "./chat-message";

interface Props {
  messages: Message[];
  chat: ChatDetail;
}
const SameDayMessages = ({ messages, chat }: Props) => {
  const { loggedUser } = useLoggedUser();

  const getAuthor = (authorId: Id<"users">) => {
    if (authorId === loggedUser?.id) return loggedUser;

    if (chat.type === "direct") {
      if (chat.participant.id === authorId) return chat.participant;

      return null;
    }

    if (chat.type === "custom") {
      return chat.participants.find((u) => u.id === authorId) ?? null;
    }

    return null;
  };

  return (
    <div className="flex flex-col-reverse">
      {messages.map((msg, index) => {
        const olderAuthorId =
          index < messages.length - 1 ? messages[index + 1].authorId : null; // older message (chronologically before)
        const newerAuthorId = index > 0 ? messages[index - 1].authorId : null; // newer message (chronologically after)

        const currentAuthorId = msg.authorId;

        const sameAsOlder = olderAuthorId === currentAuthorId;
        const sameAsNewer = newerAuthorId === currentAuthorId;

        let groupPosition: "first" | "middle" | "last" | "none";

        if (!sameAsOlder && !sameAsNewer) {
          groupPosition = "none";
        } else if (!sameAsOlder && sameAsNewer) {
          groupPosition = "first";
        } else if (sameAsOlder && sameAsNewer) {
          groupPosition = "middle";
        } else {
          groupPosition = "last";
        }

        return (
          <div key={msg.id}>
            <ChatMessage
              mode={msg.authorId === loggedUser?.id ? "sender" : "receiver"}
              messageType={groupPosition}
              author={currentAuthorId ? getAuthor(currentAuthorId) : null}
              message={msg}
            />
          </div>
        );
      })}
    </div>
  );
};

export default SameDayMessages;
