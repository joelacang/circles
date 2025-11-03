import { useRouter } from "next/navigation";
import { UserPreview } from "../types";
import { Button } from "@/components/ui/button";

interface Props {
  user: UserPreview;
}
export const UserNameButton = ({ user }: Props) => {
  const router = useRouter();
  const fullName = `${user.firstName} ${user.lastName}`;

  return (
    <Button
      variant="link"
      size="sm"
      className="size-fit p-0 font-semibold"
      onClick={() => router.push(`/@${user.username}`)}
    >
      {fullName}
    </Button>
  );
};
