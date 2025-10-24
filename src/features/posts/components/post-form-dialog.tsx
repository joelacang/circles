import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { usePostFormDialog } from "../hooks/use-post-form-dialog";
import { useTranslation } from "react-i18next";
import PostForm from "./post-form";
import { useUser } from "@clerk/nextjs";

const PostFormDialog = () => {
  const { isOpen, isPending, onClose, onOpen } = usePostFormDialog();
  const { t } = useTranslation();
  const { user } = useUser();

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
      <DialogContent className=" max-w-xl w-full">
        <DialogHeader>
          <DialogTitle>{t("posts:createPostDialogTitle")}</DialogTitle>
          <DialogDescription>
            {t("posts:createPostDialogDescription")}
          </DialogDescription>
        </DialogHeader>
        {user && <PostForm />}
      </DialogContent>
    </Dialog>
  );
};

export default PostFormDialog;
