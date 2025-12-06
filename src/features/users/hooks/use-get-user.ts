import { useQuery } from "convex/react";
import { Id } from "../../../../convex/_generated/dataModel";
import { api } from "../../../../convex/_generated/api";

interface Props {
  userId: Id<"users">;
}
const useGetUser = ({ userId }: Props) => {
  const user = useQuery(api.users.getUserById, { userId });
  const isLoading = user === undefined;

  return { user, isLoading };
};

export default useGetUser;
