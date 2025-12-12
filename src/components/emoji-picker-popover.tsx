import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import React from "react";
import { Emoji } from "@/features/chats/types";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";

interface Props {
  children: React.ReactNode;
  onSelectEmoji: (emoji: Emoji) => void;
}
const EmojiPickerPopover = ({ children, onSelectEmoji }: Props) => {
  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>

      <PopoverContent className="p-0">
        <EmojiPicker
          onEmojiClick={(emoji: EmojiClickData) => {
            onSelectEmoji({
              id: emoji.names[0] ?? "Selected Emoji",
              title: emoji.names[0] ?? "Selected Emoji",
              native: emoji.emoji,
              code: emoji.emoji,
            });
          }}
        />
      </PopoverContent>
    </Popover>
  );
};

export default EmojiPickerPopover;
