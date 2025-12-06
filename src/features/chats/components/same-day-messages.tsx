import { useLoggedUser } from "@/features/users/hooks/use-logged-user";

import { Message } from "../types";
import ChatMessage from "./chat-message";

interface Props {
  messages: Message[];
}
const SameDayMessages = ({ messages }: Props) => {
  const { loggedUser } = useLoggedUser();

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
          <div key={msg.id} id={msg.id}>
            <ChatMessage
              mode={msg.authorId === loggedUser?.id ? "sender" : "receiver"}
              messageType={groupPosition}
              message={msg}
            />
          </div>
        );
      })}
    </div>
  );
};

export default SameDayMessages;
