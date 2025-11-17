import Hint from "@/components/hint";
import { Button } from "@/components/ui/button";
import { useProfileDialog } from "@/features/users/hooks/use-profile-dialog";
import { Profile } from "../types";
import { PencilIcon } from "lucide-react";

interface Props {
  profile: Profile;
}
const EditProfileButton = ({ profile }: Props) => {
  const { onOpenProfile } = useProfileDialog();
  return (
    <Hint tooltip="Edit Profile">
      <Button
        variant="outline"
        className="hover:text-primary cursor-pointer size-fit rounded-full p-2.5 border-primary"
        onClick={() => onOpenProfile(profile)}
        size="icon"
      >
        <PencilIcon className="size-5 text-primary" />
      </Button>
    </Hint>
  );
};

export default EditProfileButton;
