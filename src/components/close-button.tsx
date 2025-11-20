import React from "react";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import Hint from "./hint";
import { cn } from "@/lib/utils";

interface Props extends React.ComponentProps<"button"> {
  className?: string;
  tooltip?: string;
  size?: "sm" | "lg";
}
const CloseButton = ({ className, tooltip, size = "sm", ...props }: Props) => {
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
        <X
          className={cn(
            " text-destructive",
            size === "sm" ? "size-4" : "size-5"
          )}
        />
      </Button>
    </Hint>
  );
};

export default CloseButton;
