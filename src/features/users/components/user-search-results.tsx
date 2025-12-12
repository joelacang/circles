import { useInfiniteQuery } from "@/hooks/use-infinite-query";
import { api } from "../../../../convex/_generated/api";
import { UserPreview } from "../types";
import { Loader2, SearchX } from "lucide-react";
import ErrorMessage from "@/components/error-message";
import UserSearchResultItem from "./user-search-result-item";
import { useState } from "react";
import { Id } from "../../../../convex/_generated/dataModel";

interface Props {
  searchValue: string;
  onAddRecipient: (recipient: UserPreview) => void;
  selectedUserIds: Id<"users">[];
}

const UserSearchResults = ({
  searchValue,
  onAddRecipient,
  selectedUserIds,
}: Props) => {
  const { results, isLoadingFirstPage } = useInfiniteQuery<
    { searchValue: string },
    UserPreview
  >(api.users.searchUser, { searchValue }, 15);
  const [selectedUsers, setSelectedUsers] =
    useState<Id<"users">[]>(selectedUserIds);

  return (
    <div className="w-full max-w-md">
      {isLoadingFirstPage ? (
        <>
          <div className="w-full flex flex-col items-center gap-4 py-8">
            <Loader2 className="animate-spin size-8 text-primary" />
            <p>
              Searching for:&nbsp;
              <span className="text-primary font-semibold">
                &apos;{searchValue}&apos;
              </span>
              ...
            </p>
          </div>
        </>
      ) : (
        <>
          {results.length === 0 ? (
            <ErrorMessage
              icon={SearchX}
              message={`No Results found for: '${searchValue}'`}
            />
          ) : (
            <>
              <p className="text-sm font-semibold mb-2">
                Search Results for:
                <span className="text-primary">{` '${searchValue}'`}</span>
              </p>

              <div className="max-h-48 overflow-y-auto z-50 pr-2">
                {results.map((user) => {
                  const isSelected = selectedUsers.includes(user.id);
                  return (
                    <div
                      key={user.id}
                      className="cursor-pointer hover:bg-primary/10"
                      onClick={() => {
                        onAddRecipient(user);
                        if (!isSelected) {
                          setSelectedUsers((prev) => [...prev, user.id]);
                        }
                      }}
                    >
                      <UserSearchResultItem user={user} selected={isSelected} />
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default UserSearchResults;
