import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useNotificationSheet } from "../hooks/use-notification-sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import NotificationSection from "./notification-section";
import useMedia from "use-media";

const NotificationSheet = () => {
  const { open, unread, onClose } = useNotificationSheet();
  const is5xl = useMedia("(min-width:1024px)");
  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="left" className={cn(is5xl ? "ml-80" : "ml-0")}>
        <SheetHeader>
          <SheetTitle>Notifications</SheetTitle>
          <SheetDescription>
            <span className="font-semibold text-primary">{unread}</span> unread
            notifications
          </SheetDescription>
        </SheetHeader>
        <div className=" h-[calc(100vh-78px)]  overflow-y-auto">
          <NotificationSection />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default NotificationSheet;
