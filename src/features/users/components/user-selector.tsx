import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import UserBadge from "./user-badge";
import { useEffect, useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import CloseButton from "@/components/close-button";
import UserSearchResults from "./user-search-results";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { UserPreview } from "../types";
import { Id } from "../../../../convex/_generated/dataModel";
import { Label } from "@/components/ui/label";

interface Props {
  onChangeUserSelection?: (users: UserPreview[]) => void;
  initialUsers?: UserPreview[];
}
const UserSelector = ({ onChangeUserSelection, initialUsers }: Props) => {
  const [searchValue, setSearchValue] = useState("");
  const debounced = useDebounce(searchValue, 500);
  const [open, setOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<UserPreview[]>(
    initialUsers ?? []
  );

  useEffect(() => {
    if (debounced.trim() !== "") {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [debounced]);

  useEffect(() => {
    if (onChangeUserSelection) {
      onChangeUserSelection(selectedUsers);
    }
  }, [selectedUsers, onChangeUserSelection]);

  const handleAddRecipient = (recipient: UserPreview) => {
    const existing = selectedUsers.some((u) => u.id === recipient.id);

    if (!existing) {
      setSelectedUsers((prev) => [...prev, recipient]);
    }
    setOpen(false);
    setSearchValue("");
  };

  const handleRemoveRecipient = (recipientId: Id<"users">) => {
    setSelectedUsers((prev) => prev.filter((u) => u.id !== recipientId));
  };

  return (
    <div className="w-full relative space-y-2">
      <InputGroup className="w-full">
        {selectedUsers.length > 0 && (
          <InputGroupAddon
            align="block-start"
            className=" flex max-h-24 h-full flex-wrap items-start justify-start  overflow-y-auto "
          >
            {selectedUsers.map((recipient) => (
              <UserBadge
                key={recipient.id}
                user={recipient}
                onRemove={handleRemoveRecipient}
              />
            ))}
          </InputGroupAddon>
        )}

        <div className="flex flex-row w-full items-center justify-between py-1">
          <InputGroupInput
            className="py-2 flex-1"
            placeholder="Enter name to search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.currentTarget.value)}
          />
          {debounced.trim() && (
            <div className="px-2">
              <CloseButton
                tooltip="Clear Search"
                onClick={() => setSearchValue("")}
              />
            </div>
          )}
        </div>
      </InputGroup>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <span className="absolute inset-0 pointer-events-none" />
        </PopoverTrigger>

        <PopoverContent
          align="start"
          sideOffset={4}
          className="w-[var(--radix-popover-trigger-width)] p-2"
        >
          <UserSearchResults
            searchValue={debounced.trim()}
            onAddRecipient={handleAddRecipient}
            selectedUserIds={selectedUsers.map((r) => r.id)}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default UserSelector;
