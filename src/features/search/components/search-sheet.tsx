import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useSearchSheet } from "../hooks/use-search-sheet";
import { cn } from "@/lib/utils";
import { useMedia } from "use-media";
import SearchSection from "./search-section";

const SearchSheet = () => {
  const { open, onOpen, onClose, pending } = useSearchSheet();
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
        <SheetHeader className="pt-4 pb-0">
          <SheetTitle>Search</SheetTitle>
          <SheetDescription>Search for Users, Groups</SheetDescription>
        </SheetHeader>
        <SearchSection />
      </SheetContent>
    </Sheet>
  );
};

export default SearchSheet;
