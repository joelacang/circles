import { useState, useEffect } from "react";
import { useAction } from "convex/react"; // or your framework's Convex hook
import { api } from "../../../../convex/_generated/api";
import { User } from "../types";

export function useGetUserDetails(clerkId: string) {
  const getUserDetails = useAction(api.users.getUserDetails);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!clerkId) return;

    setLoading(true);
    getUserDetails({ clerkId })
      .then((data) => {
        setUser(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Error loading user");
        setLoading(false);
      });
  }, [clerkId, getUserDetails]);

  return { user, loading, error };
}
