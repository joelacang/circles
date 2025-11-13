"use client";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { MessageCirclePlus, SearchIcon } from "lucide-react";
import ConversationList from "./conversation-list";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

const ConversationsSection = () => {
  const isMobile = useIsMobile();
  return (
    <div className="flex flex-col justify-start items-start gap-5 w-full">
      {/* HEADER */}
      <div className="w-full space-y-2 px-4 py-2">
        <div className="flex flex-row items-center justify-between gap-4">
          <p className="text-lg font-semibold">Messages</p>
          <Button variant="ghost" className="rounded-full" size="icon">
            <MessageCirclePlus className="size-5" />
          </Button>
        </div>

        <InputGroup>
          <InputGroupInput placeholder="Search Conversations..." />
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
        </InputGroup>
      </div>

      {/* CONVERSATION LIST */}
      <div
        className={cn(
          " w-full overflow-y-auto px-2",
          isMobile ? "h-[calc(100vh-218px)]" : "h-[calc(100vh-160px)]"
        )}
      >
        <ConversationList />
      </div>

      {/* FOOTER */}
    </div>
  );
};

export default ConversationsSection;
