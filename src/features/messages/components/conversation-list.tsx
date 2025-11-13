import ConversationCard from "./conversation-card";

const ConversationList = () => {
  return (
    <div className="w-full space-y-1">
      <ConversationCard />
      <ConversationCard />
      <ConversationCard />
      <ConversationCard selected />
      <ConversationCard />
      <ConversationCard />
      <ConversationCard />
      <ConversationCard />
    </div>
  );
};

export default ConversationList;
