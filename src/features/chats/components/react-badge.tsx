import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { EmojiGroupCount, MessageReact } from "../types";
import { Button } from "@/components/ui/button";
import { useInfiniteQuery } from "@/hooks/use-infinite-query";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import UserItemSkeleton from "@/features/users/components/user-item-skeleton";
import MessageReactDetails from "./message-react-details";

interface Props {
  emoji: EmojiGroupCount;
  messageId: Id<"messages">;
}
const ReactBadge = ({ emoji, messageId }: Props) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="sm" variant="ghost" className=" size-fit py-px px-2">
          <p className="flex items-center justify-center gap-2">
            <span className="text-2xl">{emoji.emojiNative}</span>
            <span className="text-xs font-semibold">{emoji.count}</span>
          </p>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="py-2 px-0">
        <div className="px-3 pb-2">
          <p className="font-semibold">Reactions from:</p>
        </div>
        <MessageReactDetails emoji={emoji} messageId={messageId} />
      </PopoverContent>
    </Popover>
  );
};

export default ReactBadge;
