import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useSearchSheet } from "../hooks/use-search-sheet";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useMedia } from "use-media";

const SearchSheet = () => {
  const { open, onOpen, onClose, pending } = useSearchSheet();
  const isMobile = useIsMobile();
  const is5xl = useMedia("(min-width:1024px)");

  return (
    <Sheet
      open={open}
      onOpenChange={(openValue) => {
        if (pending) return;

        if (openValue) {
          onOpen();
        } else {
          onClose();
        }
      }}
    >
      <SheetContent side="left" className={cn(is5xl ? "ml-80" : "ml-0")}>
        <SheetHeader>
          <SheetTitle>Search</SheetTitle>
          <SheetDescription>Search Users, Circles</SheetDescription>
        </SheetHeader>
        <div></div>
      </SheetContent>
    </Sheet>
  );
};

export default SearchSheet;
