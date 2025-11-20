import { Eraser, Image, ImageIcon, Paperclip, Smile } from "lucide-react";
import Hint from "./hint";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "./ui/input-group";
import React, { useRef } from "react";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import EmojiPicker from "./emoji-picker";
import { useInsertToText } from "@/hooks/use-insert-text";
import { Emoji } from "@/features/chats/types";

interface Props extends React.ComponentProps<"textarea"> {
  placeholder?: string;
  clearButton?: boolean;
  emojiPicker?: boolean;
  attachFile?: boolean;
  attachImage?: boolean;
  maxCharacters?: number;
  charLimitLabel?: boolean;
  topAddon?: React.ReactNode;
  className?: string;
  value: string;
  minHeight?: string;
  maxHeight?: string;
  onChangeValue: (value: string) => void;
}

const InputTextareaGroup = ({
  placeholder = "",
  clearButton = false,
  emojiPicker = false,
  attachImage = false,
  attachFile = false,
  maxCharacters,
  charLimitLabel,
  className,
  topAddon,
  value,
  minHeight = "min-h-28",
  maxHeight = "max-h-[20vh]",
  onChangeValue,
  ...props
}: Props) => {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const insertToText = useInsertToText(value, onChangeValue, inputRef);

  const { t } = useTranslation();
  const handleSelectEmoji = (emoji: Emoji) => {
    insertToText(emoji.native);
  };
  const isEmpty = value.trim() === "";
  return (
    <InputGroup>
      {topAddon && (
        <InputGroupAddon align="block-start" className="w-full">
          {topAddon}
        </InputGroupAddon>
      )}
      <InputGroupTextarea
        ref={inputRef}
        className={cn(minHeight, maxHeight, className)}
        placeholder={placeholder}
        value={value}
        maxLength={maxCharacters}
        onChange={(e) => {
          e.preventDefault();
          e.stopPropagation();

          onChangeValue(e.currentTarget.value);
        }}
        {...props}
      />
      <InputGroupAddon
        className="flex flex-row items-center justify-between gap-4"
        align="block-end"
      >
        <div className="flex flex-row items-center justify-start">
          {attachImage && (
            <Hint tooltip={t("posts:imageTooltip")}>
              <InputGroupButton type="button">
                <ImageIcon />
              </InputGroupButton>
            </Hint>
          )}
          {attachFile && (
            <Hint tooltip="Attach File">
              <InputGroupButton type="button">
                <Paperclip />
              </InputGroupButton>
            </Hint>
          )}

          {emojiPicker && (
            <Hint tooltip={t("posts:emojiTooltip")}>
              <EmojiPicker onSelectEmoji={handleSelectEmoji}>
                <InputGroupButton
                  type="button"
                  className="rounded-full cursor-pointer"
                  variant="ghost"
                  size="sm"
                >
                  <Smile />
                </InputGroupButton>
              </EmojiPicker>
            </Hint>
          )}
        </div>

        {charLimitLabel && maxCharacters && (
          <div className="p-2">
            <p className={cn("text-xs font-light text-muted-foreground")}>
              <span
                className={cn(
                  value.length > maxCharacters && "text-destructive"
                )}
              >{`${value.length}/350`}</span>
            </p>
          </div>
        )}

        {clearButton && (
          <div
            className={cn(
              isEmpty ? "opacity-0" : "opacity-100",
              "transition-opacity"
            )}
          >
            <InputGroupButton
              disabled={isEmpty}
              onClick={() => {
                onChangeValue("");
              }}
            >
              <Eraser />
              Clear
            </InputGroupButton>
          </div>
        )}
      </InputGroupAddon>
    </InputGroup>
  );
};

export default InputTextareaGroup;
