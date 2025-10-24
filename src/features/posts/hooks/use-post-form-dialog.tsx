import { create } from "zustand";

type PostFormDialogState = {
  isOpen: boolean;
  isPending: boolean;
  onOpen: () => void;
  onPending: () => void;
  onCompleted: () => void;
  onClose: () => void;
};

export const usePostFormDialog = create<PostFormDialogState>((set) => ({
  isOpen: false,
  isPending: false,
  onOpen: () => set({ isOpen: true }),
  onPending: () => set({ isPending: true }),
  onCompleted: () => set({ isPending: false }),
  onClose: () => set({ isOpen: false }),
}));
