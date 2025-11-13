import ConversationSectionCompact from "@/features/messages/components/conversation-section-compact";
import ConversationsSection from "@/features/messages/components/conversations-section";
import { cn } from "@/lib/utils";

const MessagesLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full border rounded-xl flex flex-row h-full @container">
      {/* CONVERSATIONS LISTS SECTION */}
      <div className={cn(" w-full @xl:w-20 @3xl:w-sm @xl:border-r")}>
        <div className=" hidden @xl:block @3xl:hidden">
          <ConversationSectionCompact />
        </div>
        <div className="block @xl:hidden @3xl:block">
          <ConversationsSection />
        </div>
      </div>
      {/* CHAT MESSAGES SECTION */}

      <div className={cn(" flex-1 w-full hidden @xl:flex")}>{children}</div>
    </div>
  );
};

export default MessagesLayout;
