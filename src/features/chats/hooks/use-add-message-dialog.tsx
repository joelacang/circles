import { create } from "zustand";
import { Message, MessageDraft } from "../types";
import { UserPreview } from "@/features/users/types";
import { Id } from "../../../../convex/_generated/dataModel";

type AddNewMessageDialogState = {
  open: boolean;
  pending: boolean;
  draft: MessageDraft | null;
  message: Message | null;
  messageToReply: Message | null;
  onOpenDraft: (draft: MessageDraft) => void;
  onOpenForwardMsg: (message: Message) => void;
  onAddRecipient: (recipient: UserPreview) => void;
  onReplyMessage: (message: Message) => void;
  onRemoveReply: () => void;
  onRemoveRecipient: (recipientId: Id<"users">) => void;
  onChangeRecipients: (recipients: UserPreview[]) => void;
  onEditBody: (body: string) => void;
  onClearBody: () => void;
  onClear: () => void;
  onOpen: () => void;
  onClose: () => void;
  onPending: () => void;
  onCompleted: () => void;
};

export const useAddNewMessageDialog = create<AddNewMessageDialogState>(
  (set) => ({
    open: false,
    pending: false,
    draft: null,
    message: null,
    messageToReply: null,
    onOpenDraft: (draft) => set({ open: true, draft }),
    onOpenForwardMsg: (message) =>
      set({
        open: true,
        message: message,
        draft: { body: "", recipients: [] },
      }),
    onAddRecipient: (recipient) => {
      const state = useAddNewMessageDialog.getState();

      if (!state.draft) return;

      const exists = state.draft.recipients.some((r) => r.id === recipient.id);

      if (!exists) {
        set({
          draft: {
            ...state.draft,
            recipients: [...state.draft.recipients, recipient],
          },
        });
      }
    },
    onReplyMessage: (message) => set({ messageToReply: message }),
    onRemoveReply: () => set({ messageToReply: null }),
    onRemoveRecipient: (recipientId) => {
      const state = useAddNewMessageDialog.getState();

      if (!state.draft) return;

      set({
        draft: {
          ...state.draft,
          recipients: state.draft.recipients.filter(
            (r) => r.id !== recipientId
          ),
        },
      });
    },
    onChangeRecipients: (recipients) => {
      const state = useAddNewMessageDialog.getState();

      if (!state.draft) return;

      const unique = Array.from(
        new Map(recipients.map((u) => [u.id, u])).values()
      );
      set({
        draft: {
          ...state.draft,
          recipients: unique,
        },
      });
    },
    onEditBody: (body) => {
      const state = useAddNewMessageDialog.getState();

      if (!state.draft) return;

      set({
        draft: {
          ...state.draft,
          body,
        },
      });
    },
    onClearBody: () => {
      const state = useAddNewMessageDialog.getState();

      if (!state.draft) return;

      set({
        draft: {
          ...state.draft,
          body: "",
        },
      });
    },
    onClear: () =>
      set({
        draft: { body: "", recipients: [] },
        message: null,
        messageToReply: null,
      }),
    onOpen: () => set({ open: true, draft: { recipients: [], body: "" } }),
    onClose: () =>
      set({ open: false, draft: null, message: null, messageToReply: null }),
    onPending: () => set({ pending: true }),
    onCompleted: () => set({ pending: false }),
  })
);
