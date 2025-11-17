import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAddNewMessageDialog } from "../hooks/use-add-message-dialog";
import { Button } from "@/components/ui/button";
import { MailPlus, Send } from "lucide-react";
import { useConfirmationAlert } from "@/features/confirm-dialog/hooks/use-confirmation-alert";
import MessageDialogForm from "./message-dialog-form";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useConvexMutationHandler } from "@/hooks/use-convex-mutation-handler";
import toast from "react-hot-toast";
import ToastMessage from "@/components/toast-message";
import { MODE } from "@/types/enum";

const MessageDialog = () => {
  const {
    open,
    pending: addMessagePending,
    onClose: onCloseAddMessage,
    onPending: onAddMessagePending,
    onCompleted: onAddMessageCompleted,
  } = useAddNewMessageDialog();
  const {
    onOpen: openConfirmation,
    isPending: confirmAlertPending,
    onPending: onConfirmAlertPending,
    onCompleted: onConfirmAlertCompleted,
    onClose: onCloseConfirmAlert,
  } = useConfirmationAlert();
  const { draft } = useAddNewMessageDialog();
  const createDraftFn = useMutation(api.messageDrafts.create);
  const { mutate: createDraft } = useConvexMutationHandler(createDraftFn);
  const sendMessageFn = useMutation(api.messages.sendCustomMessage);
  const { mutate: sendMessage } = useConvexMutationHandler(sendMessageFn);

  const handleSave = () => {
    if (!draft) return;

    const { body, recipients } = draft;

    if (!draft.id) {
      createDraft(
        { body, recipients: recipients.map((r) => r.id) },
        {
          onLoading: () => {
            onAddMessagePending();
            toast.custom(
              () => (
                <ToastMessage mode={MODE.LOADING} message="Creating Draft..." />
              ),
              { id: "creating-draft-toast", duration: Infinity }
            );
          },
          onSuccess: () => {
            toast.custom(() => (
              <ToastMessage
                mode={MODE.SUCCESS}
                message="Message saved to your drafts."
              />
            ));
            onCloseAddMessage();
          },
          onError: (error) => {
            toast.custom(() => (
              <ToastMessage
                mode={MODE.ERROR}
                message="Error saving your message to drafts."
                description={error}
              />
            ));
          },
          onSettled: () => {
            toast.dismiss("creating-draft-toast");
            onAddMessageCompleted();
          },
        }
      );
    }
  };

  const handleSend = () => {
    if (!draft) return;

    const { body, recipients } = draft;

    if (!draft.id) {
      sendMessage(
        { body, recipientIds: recipients.map((r) => r.id) },
        {
          onLoading: () => {
            onAddMessagePending();
            onConfirmAlertPending();
            toast.custom(
              () => (
                <ToastMessage
                  mode={MODE.LOADING}
                  message="Sending Message..."
                />
              ),
              { id: "send-message-toast", duration: Infinity }
            );
          },
          onSuccess: () => {
            toast.custom(() => (
              <ToastMessage mode={MODE.SUCCESS} message="Message sent." />
            ));
            onCloseConfirmAlert();
            onCloseAddMessage();
          },
          onError: (error) => {
            toast.custom(() => (
              <ToastMessage
                mode={MODE.ERROR}
                message="Error sending your message."
                description={error}
              />
            ));
          },
          onSettled: () => {
            toast.dismiss("send-message-toast");
            onAddMessageCompleted();
            onConfirmAlertCompleted();
          },
        }
      );
    }
  };

  const handleClose = () => {
    onCloseAddMessage();
  };

  const handleConfirm = () => {
    if (draft?.body.trim() !== "" || draft?.recipients.length > 0) {
      openConfirmation({
        title: "Save your message?",
        message:
          "Would you like to save this message as a draft so you can finish it later?",
        icon: MailPlus,
        mode: "default",
        actionLabel: "Save as Draft",
        cancelLabel: "Continue Editing",
        destructLabel: "Don't Save",
        enableConfirmation: false,
        action: () => {
          handleSave();
        },
        destruct: () => {
          handleClose();
        },
      });
    } else {
      handleClose();
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        if (addMessagePending || confirmAlertPending) return;

        handleConfirm();
      }}
    >
      <DialogContent className="w-full">
        <DialogHeader>
          <DialogTitle>Add New Message</DialogTitle>
          <DialogDescription>
            Start chatting with someone new.
          </DialogDescription>
        </DialogHeader>
        <MessageDialogForm />
        <DialogFooter>
          <Button
            onClick={handleSend}
            disabled={addMessagePending || confirmAlertPending}
          >
            <Send />
            Send
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MessageDialog;
