import Hint from "@/components/hint";
import { Button } from "@/components/ui/button";
import UserAvatar from "@/features/users/components/user-avatar";
import { Plus, Search } from "lucide-react";

const ConversationSectionCompact = () => {
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="space-y-2  flex flex-col items-center justify-center">
        <Hint tooltip="Add Conversation">
          <Button className="size-10 rounded-full">
            <Plus className="size-6" />
          </Button>
        </Hint>
        <Hint tooltip="Search Conversation">
          <Button className="size-10 rounded-full">
            <Search className="size-6" />
          </Button>
        </Hint>
      </div>

      <div className="pt-6 space-y-3 flex flex-col items-center justify-center">
        <div className="p-1 bg-gradient-to-br from-rose-400 via-purple-500 to-purple-700 rounded-full shadow-lg cursor-pointer">
          <Hint tooltip="User's Name Here">
            <UserAvatar
              className="bg-gray-200 border border-white"
              imageUrl="/images/avatar-placeholder.png"
            />
          </Hint>
        </div>

        <UserAvatar
          className="bg-gray-200"
          imageUrl="/images/avatar-placeholder.png"
        />
        <UserAvatar
          className="bg-gray-200"
          imageUrl="/images/avatar-placeholder.png"
        />
        <UserAvatar
          className="bg-gray-200"
          imageUrl="/images/avatar-placeholder.png"
        />
      </div>
    </div>
  );
};

export default ConversationSectionCompact;
