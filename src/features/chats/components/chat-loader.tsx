import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import ErrorMessage from "@/components/error-message";
import { SearchX } from "lucide-react";
import ChatRoomSection from "./chat-room-section";
import { useIsMobile } from "@/hooks/use-mobile";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";

interface Props {
  chatId: Id<"chats">;
}
const ChatLoader = ({ chatId }: Props) => {
  const chat = useQuery(api.chats.getChat, { chatId });
  const isMobile = useIsMobile();

  if (chat === undefined) {
    return (
      <div className="border-b w-full flex flex-row items-start justify-between p-2 gap-2">
        {isMobile && <Skeleton className="size-10 rounded-full" />}
        <Item className="p-1 w-full">
          <ItemMedia>
            <Skeleton className="size-10 rounded-full" />
          </ItemMedia>
          <ItemContent>
            <ItemGroup className="space-y-1">
              <Skeleton className="w-24 h-5" />
              <Skeleton className="w-16 h-4" />
            </ItemGroup>
          </ItemContent>
          <ItemActions>
            <Skeleton className="size-10 rounded-full" />
          </ItemActions>
        </Item>
      </div>
    );
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
