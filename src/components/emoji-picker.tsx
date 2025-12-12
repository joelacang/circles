/* eslint-disable @typescript-eslint/no-explicit-any */

import Picker from "@emoji-mart/react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import React from "react";
import { Emoji } from "@/features/chats/types";

interface Props {
  children: React.ReactNode;
  onSelectEmoji: (emoji: Emoji) => void;
}
const EmojiPicker = ({ children, onSelectEmoji }: Props) => {
  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>

      <PopoverContent className="p-0">
        <Picker
          onEmojiSelect={(emoji: any) => {
            onSelectEmoji({
              id: emoji.id as string,
              title: emoji.name as string,
              native: emoji.native as string,
              code: emoji.shortcodes as string,
            });
          }}
        />
      </PopoverContent>
    </Popover>
  );
};

export default EmojiPicker;
