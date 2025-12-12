import { MoreHorizontal, SmilePlus, X } from "lucide-react";
import { Button } from "../../../components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../components/ui/popover";
import Hint from "../../../components/hint";
import EmojiPickerPopover from "../../../components/emoji-picker-popover";
import { api } from "../../../../convex/_generated/api";
import { useConvexMutationHandler } from "@/hooks/use-convex-mutation-handler";
import { useMutation } from "convex/react";
import { Id } from "../../../../convex/_generated/dataModel";
import toast from "react-hot-toast";
import ToastMessage from "@/components/toast-message";
import { MODE } from "@/types/enum";
import { useState } from "react";
import { Emoji } from "../types";

interface Props {
  messageId: Id<"messages">;
}
const ReactionButton = ({ messageId }: Props) => {
  const [open, setOpen] = useState(false);
  const reactMutationFn = useMutation(api.messageReactions.reactMessage);
  const { mutate: reactMessage, isLoading } =
    useConvexMutationHandler(reactMutationFn);

  const emojis: Emoji[] = [
    { id: "joy", title: "LOL", native: "😂", code: ":joy:" },
    {
      id: "+1",
      title: "Like",
      native: "👍",
      code: ":+1:",
    },
    { id: "heart", title: "Love", native: "❤️", code: ":heart:" },
    { id: "clap", title: "Clap", native: "👏", code: ":clap:" },
    { id: "rage", title: "Angry", native: "😡", code: ":rage:" },
  ];

  const handleReactMessage = (emoji: Emoji) => {
    reactMessage(
      {
        messageId,
        emojiNative: emoji.native,
        emojiCode: emoji.code,
      },
      {
        onSuccess: () => {
          setOpen(false);
        },
        onError: (error) => {
          toast.custom(() => (
            <ToastMessage
              mode={MODE.ERROR}
              message="Error reacting to message:"
              description={error}
              icon={X}
            />
          ));
        },
      }
    );
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button className="rounded-full" size="icon" variant="ghost">
          <SmilePlus className="text-primary" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full rounded-2xl p-2 flex gap-2">
        {emojis.map((emoji) => (
          <Hint key={emoji.id} tooltip={emoji.title}>
            <Button
              className="rounded-full hover:scale-125"
              size="icon"
              variant="ghost"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleReactMessage(emoji);
              }}
              disabled={isLoading}
            >
              <span className="text-2xl">{emoji.native}</span>
            </Button>
          </Hint>
        ))}

        <Hint tooltip="More Emojis">
          <div>
            <EmojiPickerPopover onSelectEmoji={handleReactMessage}>
              <Button className="rounded-full" size="icon" variant="ghost">
                <MoreHorizontal className="text-primary" />
              </Button>
            </EmojiPickerPopover>
          </div>
        </Hint>
      </PopoverContent>
    </Popover>
  );
};

export default ReactionButton;
