/* eslint-disable react-hooks/exhaustive-deps */
import { Eraser, Smile } from "lucide-react";
import Hint from "./hint";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "./ui/input-group";
import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import EmojiPicker from "./emoji-picker";
import { useInsertToText } from "@/hooks/use-insert-text";
import { Emoji } from "@/features/chats/types";
import { LocalFile } from "@/features/attachments/types";
import AddAttachmentButton from "@/features/attachments/components/add-attachment-button";
import AttachmentPreviewSection from "@/features/attachments/components/attachment-preview-section";

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
  onFilesChange?: (files: LocalFile[]) => void;
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
  onFilesChange,
  ...props
}: Props) => {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const insertToText = useInsertToText(value, onChangeValue, inputRef);
  const [files, setFiles] = useState<LocalFile[]>([]);

  const { t } = useTranslation();

  const handleSelectEmoji = (emoji: Emoji) => {
    insertToText(emoji.native);
  };

  const isEmpty = value.trim() === "";

  const handleSelectFiles = (selectedFiles: File[]) => {
    const updatedFiles: LocalFile[] = selectedFiles.map((f) => ({
      file: f,
      url: URL.createObjectURL(f),
    }));

    setFiles((prev) => [...prev, ...updatedFiles]);
  };

  const handleChangeFiles = (updatedFiles: LocalFile[]) => {
    setFiles(updatedFiles);
  };

  useEffect(() => {
    if (onFilesChange) {
      onFilesChange(files);
    }
  }, [files]);

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
      <InputGroupAddon className="flex flex-col gap-4" align="block-end">
        {files.length > 0 && (
          <div className="w-full max-h-36 overflow-y-auto">
            <AttachmentPreviewSection
              files={files}
              onFilesChanged={handleChangeFiles}
            />
          </div>
        )}
        <div className="flex w-full flex-row items-center justify-between">
          <div className="flex flex-row items-center justify-start">
            {attachImage && (
              <AddAttachmentButton
                className="rounded-full"
                onFilesSelected={handleSelectFiles}
                tooltip="Attach Images"
                multiple
                imageOnly
              />
            )}
            {attachFile && (
              <AddAttachmentButton
                className="rounded-full"
                onFilesSelected={handleSelectFiles}
                tooltip="Attach Images"
                multiple
              />
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
        </div>
      </InputGroupAddon>
    </InputGroup>
  );
};

export default InputTextareaGroup;
