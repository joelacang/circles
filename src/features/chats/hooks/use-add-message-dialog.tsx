import { create } from "zustand";
import { Message, MessageDraft } from "../types";
import { UserPreview } from "@/features/users/types";
import { Id } from "../../../../convex/_generated/dataModel";
import { LocalFile } from "@/features/attachments/types";

type AddNewMessageDialogState = {
  open: boolean;
  pending: boolean;
  draft: MessageDraft | null;
  message: Message | null;
  searchUsers: boolean;
  attachments: LocalFile[];
  onOpenDraft: (draft: MessageDraft, searchUsers?: boolean) => void;
  onOpenWithRecipients: (
    recipients: UserPreview[],
    searchUsers?: boolean
  ) => void;
  onOpenForwardMsg: (message: Message, searchUsers?: boolean) => void;
  onAddRecipient: (recipient: UserPreview) => void;
  onRemoveRecipient: (recipientId: Id<"users">) => void;
  onChangeRecipients: (recipients: UserPreview[]) => void;
  onAttachmentChange: (attachments: LocalFile[]) => void;
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
    searchUsers: false,
    attachments: [],
    onOpenDraft: (draft, searchUsers) =>
      set({ open: true, draft, searchUsers: searchUsers ?? false }),
    onOpenWithRecipients: (recipients, searchUsers) =>
      set({
        open: true,
        draft: { recipients, body: "" },
        searchUsers: searchUsers ?? false,
      }),
    onOpenForwardMsg: (message, searchUsers) =>
      set({
        open: true,
        message: message,
        draft: { body: "", recipients: [] },
        searchUsers: searchUsers ?? false,
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
    onAttachmentChange: (attachments) => set({ attachments }),
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
        attachments: [],
      }),
    onOpen: () =>
      set({
        open: true,
        draft: { recipients: [], body: "" },
        searchUsers: true,
      }),
    onClose: () =>
      set({ open: false, draft: null, message: null, attachments: [] }),
    onPending: () => set({ pending: true }),
    onCompleted: () => set({ pending: false }),
  })
);
