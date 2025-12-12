import Hint from "@/components/hint";
import { Button } from "@/components/ui/button";
import { Image, Paperclip } from "lucide-react";
import React, { useRef } from "react";

interface Props extends React.ComponentProps<"button"> {
  tooltip?: string;
  variant?:
    | "link"
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost";
  iconColor?: string;
  buttonMode?: "default" | "sm" | "lg" | "icon" | "icon-sm" | "icon-lg";
  iconSize?: number;
  multiple?: boolean;
  imageOnly?: boolean;
  onFilesSelected?: (files: File[]) => void;
}
const AddAttachmentButton = ({
  tooltip,
  variant = "ghost",
  buttonMode = "icon",
  className,
  iconColor = "#9c6fff",
  multiple = false,
  imageOnly = false,
  iconSize,
  onFilesSelected,
  ...props
}: Props) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const Icon = imageOnly ? Image : Paperclip;

  const handleAttachmentButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    e.preventDefault();

    if (files && onFilesSelected) {
      onFilesSelected(Array.from(files));
    }
  };

  return (
    <div>
      <Hint tooltip={tooltip ?? "Add Attachment"}>
        <Button
          type="button"
          variant={variant}
          size={buttonMode}
          className={className}
          onClick={handleAttachmentButtonClick}
          {...props}
        >
          <Icon color={iconColor} size={iconSize} />
        </Button>
      </Hint>
      <input
        ref={fileInputRef}
        type="file"
        style={{ display: "none" }}
        multiple={multiple}
        accept={imageOnly ? "image/*" : "*"}
        onChange={handleFileChange}
      />
    </div>
  );
};

export default AddAttachmentButton;
