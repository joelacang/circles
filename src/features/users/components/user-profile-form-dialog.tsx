import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useProfileDialog } from "../hooks/use-profile-dialog";
import UserProfileForm from "./user-profile-form";
import { useTranslation } from "react-i18next";

const UserProfileFormDialog = () => {
  const { isOpen, isPending, onClose, onOpen } = useProfileDialog();
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

        <UserProfileForm />
      </DialogContent>
    </Dialog>
  );
};

export default UserProfileFormDialog;
