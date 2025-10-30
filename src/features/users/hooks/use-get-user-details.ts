import { useState, useEffect } from "react";
import { useAction } from "convex/react"; // or your framework's Convex hook
import { api } from "../../../../convex/_generated/api";
import { UserPreview } from "../types";
import { useUser } from "@clerk/nextjs";

export function useGetUserDetails(clerkId: string) {
  const getUserDetails = useAction(api.users.getUserDetails);
  const [user, setUser] = useState<UserPreview | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user: loggedUser } = useUser();

  useEffect(() => {
    // If querying for the logged-in user, use local data
    if (loggedUser && clerkId === loggedUser.id) {
      setUser({
        id: loggedUser.id,
        firstName: loggedUser.firstName,
        lastName: loggedUser.lastName,
        username: loggedUser.username,
        imageUrl: loggedUser.imageUrl,
      });
      setLoading(false);
      setError(null);
      return;
    }

    // Otherwise fetch from the server
    let cancelled = false;
    setLoading(true);
    setError(null);

    getUserDetails({ clerkId })
      .then((data) => {
        if (!cancelled) {
          setUser(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message || "Error loading user");
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [clerkId, loggedUser, getUserDetails]);

  return { user, loading, error };
}
