import { create } from "zustand";

type ProfileDialogState = {
  isOpen: boolean;
  isPending: boolean;
  onOpen: () => void;
  onClose: () => void;
  onPending: () => void;
  onCompleted: () => void;
};

export const useProfileDialog = create<ProfileDialogState>((set) => ({
  isOpen: false,
  isPending: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
  onPending: () => set({ isPending: true }),
  onCompleted: () => set({ isPending: false }),
}));
