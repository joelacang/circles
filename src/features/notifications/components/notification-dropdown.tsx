import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BellIcon } from "lucide-react";
import NotificationSection from "./notification-section";
import { DropdownMenuGroup } from "@radix-ui/react-dropdown-menu";
import { Badge } from "@/components/ui/badge";

const NotificationDropdown = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="relative">
          <Button variant="ghost" className="rounded-full " size="sm">
            <BellIcon className="size-5" />
          </Button>
          <div className="absolute -top-2 right-1">
            <Badge className="rounded-full leading-none px-1 py-0 text-xs font-semibold">
              23
            </Badge>
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-sm pb-4">
        <DropdownMenuGroup className="px-3 py-4">
          <p className="text-lg font-semibold leading-none">Notifications</p>
          <p className="text-sm text-muted-foreground">
            32 unread Notifications
          </p>
        </DropdownMenuGroup>

        <div className=" h-full flex-1 overflow-y-auto">
          <NotificationSection />
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationDropdown;
