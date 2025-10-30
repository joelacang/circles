import { useAction } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useEffect, useState } from "react";
import { UserPreview } from "../types";
import { useUser } from "@clerk/nextjs";
import { getUserDetails } from "../../../../convex/users";

export function useGetUserByUsername(username: string) {
  const getUserByUsername = useAction(api.users.getUserByUsername);
  const [user, setUser] = useState<UserPreview | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user: loggedUser } = useUser();

  useEffect(() => {
    if (loggedUser && username === loggedUser.username) {
      setUser({
        id: loggedUser.id,
        firstName: loggedUser.firstName,
        lastName: loggedUser.lastName,
        username: loggedUser.username,
        imageUrl: loggedUser.imageUrl,
      });
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    getUserByUsername({ username })
      .then((data) => {
        if (!cancelled) {
          setUser(data);
          setLoading(false);
        }
      })
      .catch((error) => {
        setError(error.message || "Error loading user");
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [username, loggedUser, getUserByUsername]);

  return { user, loading, error };
}
