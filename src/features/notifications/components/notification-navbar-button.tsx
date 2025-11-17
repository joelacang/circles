import { Button } from "@/components/ui/button";
import { BellIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useNotificationSheet } from "../hooks/use-notification-sheet";
import Hint from "@/components/hint";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

const NotificationNavbarButton = () => {
  const { onOpen } = useNotificationSheet();
  const unread = useQuery(api.notifications.getUnreadNotifCount);

  return (
    <div className="relative">
      <Hint tooltip="Notifications">
        <Button
          variant="ghost"
          className="rounded-full "
          size="sm"
          onClick={() => onOpen(unread ?? 0)}
        >
          <BellIcon className="size-5" />
        </Button>
      </Hint>
      {unread && unread > 0 ? (
        <div className="absolute -top-2 right-1">
          <Badge className="rounded-full leading-none px-1 py-0 text-xs font-semibold">
            {unread}
          </Badge>
        </div>
      ) : null}
    </div>
  );
};

export default NotificationNavbarButton;
