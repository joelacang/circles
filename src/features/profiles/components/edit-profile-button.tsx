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
        className="hover:text-primary cursor-pointer rounded-full"
        onClick={() => onOpenProfile(profile)}
      >
        <PencilIcon />
      </Button>
    </Hint>
  );
};

export default EditProfileButton;
