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

const NotificationSheet = () => {
  const { open, unread, onClose } = useNotificationSheet();
  const isMobile = useIsMobile();
  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="left" className={cn(isMobile ? "ml-0" : "ml-80")}>
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
