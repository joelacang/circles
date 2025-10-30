import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useProfileDialog } from "../../users/hooks/use-profile-dialog";
import UserProfileForm from "./user-profile-form";
import { useTranslation } from "react-i18next";
import { useUser } from "@clerk/nextjs";

const UserProfileFormDialog = () => {
  const { isOpen, isPending, onClose, onOpen, profile } = useProfileDialog();
  const { user } = useUser();
  const { t } = useTranslation();
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(openValue) => {
        if (isPending) return;

        if (openValue) {
          onOpen();
        } else {
          onClose();
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("users:profileDialogTitle")}</DialogTitle>
          <DialogDescription>{t("users:profileDialogDesc")}</DialogDescription>
        </DialogHeader>

        {user && <UserProfileForm profile={profile} clerkId={user?.id} />}
      </DialogContent>
    </Dialog>
  );
};

export default UserProfileFormDialog;
