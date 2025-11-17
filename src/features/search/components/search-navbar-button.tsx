import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useSearchSheet } from "../hooks/use-search-sheet";
import Hint from "@/components/hint";

const SearchNavbarButton = () => {
  const { onOpen } = useSearchSheet();
  return (
    <Hint tooltip="Search">
      <Button
        className="rounded-full"
        onClick={onOpen}
        variant="ghost"
        size="icon"
      >
        <Search />
      </Button>
    </Hint>
  );
};

export default SearchNavbarButton;
