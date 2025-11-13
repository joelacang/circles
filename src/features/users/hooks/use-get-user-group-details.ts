import { useAction } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useEffect, useState } from "react";
import { UserPreview } from "../types";
import { useUser } from "@clerk/nextjs";

export function useGetUserGroupDetails(clerkIds: string[]) {
  const getUserGroupDetails = useAction(api.users.getUserGroupDetails);
  const [users, setUsers] = useState<UserPreview[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user: loggedUser } = useUser();

  useEffect(() => {
    if (!clerkIds || clerkIds.length === 0) {
      setUsers([]);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    getUserGroupDetails({ users: clerkIds })
      .then((data) => {
        if (!cancelled) {
          setUsers(data);
          setLoading(false);
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setError(error.message || "Error loading users");
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [clerkIds, loggedUser]);

  return { users, loading, error };
}
