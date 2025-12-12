/* eslint-disable react-hooks/exhaustive-deps */
import UserItem from "@/features/users/components/user-item";
import { Message } from "../types";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

import { format } from "date-fns";
import { Expand, LucideIcon, Minimize2 } from "lucide-react";
import { Id } from "../../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import CloseButton from "@/components/close-button";
import Hint from "@/components/hint";
import { HTMLProps, useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface Props extends HTMLProps<HTMLDivElement> {
  message: Message;
  authorId: Id<"users">;
  removable?: boolean;
  minimizable?: boolean;
  minimized?: boolean;
  title?: string;
  icon?: LucideIcon;
  onClose?: () => void;
  className?: string;
  children?: React.ReactNode;
}
const MessagePreviewCard = ({
  message,
  authorId,
  removable = false,
  minimizable = false,
  minimized = false,
  title,
  icon,
  onClose,
  children,
  ...props
}: Props) => {
  const isMobile = useIsMobile();
  const user = useQuery(api.users.getUserById, { userId: authorId });
  const Icon = icon;
  const [minimize, setMinimize] = useState(minimized);
  const Zoom = minimize ? Expand : Minimize2;

  useEffect(() => {
    if (!minimized) {
      setMinimize(isMobile);
    }
  }, [isMobile]);

  if (!user) return null;

  return (
    <div
      className={cn(
        " relative w-full bg-slate-100 dark:bg-slate-800 rounded-r-xl border border-l-4 border-l-primary shadow-lg p-2"
      )}
      {...props}
    >
      <div className="absolute top-4 right-4 space-x-1">
        {minimizable && !minimized && (
          <Hint tooltip={minimize ? "Expand" : "Minimize"}>
            <Button
              className="rounded-full size-fit p-1.5"
              size="icon"
              variant="ghost"
              onClick={() => setMinimize((prev) => !prev)}
            >
              {<Zoom className="size-4 text-primary" />}
            </Button>
          </Hint>
        )}
        {removable && <CloseButton tooltip="Remove" onClick={onClose} />}
      </div>

      {title && (
        <div className="flex flex-row  items-center justify-start text-primary gap-2 px-3">
          {Icon && <Icon className="size-3 text-primary" />}
          <p className="text-sm font-semibold">{title}</p>
        </div>
      )}

      <UserItem
        user={user}
        size="sm"
        subtitle={minimize ? message.body : format(message.dateCreated, "Pp")}
      />
      {!minimize && (
        <div className="p-2">
          <p className="line-clamp-2">{message.body}</p>
        </div>
      )}
      {children}
    </div>
  );
};

export default MessagePreviewCard;
