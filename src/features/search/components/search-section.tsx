import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { useDebounce } from "@/hooks/use-debounce";
import { Search } from "lucide-react";
import { useState } from "react";
import SearchResults from "./search-results";

const SearchSection = () => {
  const [searchText, setSearchText] = useState("");
  const searchValue = useDebounce(searchText, 800);

  return (
    <div>
      <div className="px-2 pb-4">
        <InputGroup>
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
          <InputGroupInput
            placeholder="Enter name to search..."
            value={searchText}
            onChange={(e) => {
              e.stopPropagation();
              e.preventDefault();

              setSearchText(e.currentTarget.value);
            }}
          />
        </InputGroup>
      </div>

      <div className="h-[calc(100vh-120px)] overflow-y-auto">
        <div className="pb-8">
          {searchValue && (
            <div className=" space-y-2">
              <SearchResults searchValue={searchValue} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchSection;
