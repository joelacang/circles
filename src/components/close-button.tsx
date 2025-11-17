import React from "react";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import Hint from "./hint";
import { cn } from "@/lib/utils";

interface Props extends React.ComponentProps<"button"> {
  className?: string;
  tooltip?: string;
}
const CloseButton = ({ className, tooltip, ...props }: Props) => {
  return (
    <Hint tooltip={tooltip ?? "Close"}>
      <Button
        className={cn(
          "size-fit rounded-full p-1 shrink-0 hover:bg-destructive/10 hover:dark:bg-destructive/10",
          className
        )}
        size="icon"
        variant="ghost"
        {...props}
      >
        <X className="size-4 text-destructive" />
      </Button>
    </Hint>
  );
};

export default CloseButton;
