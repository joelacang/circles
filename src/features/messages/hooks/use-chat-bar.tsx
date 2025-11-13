import { create } from "zustand";

type ChatBarState = {
  open: boolean;
  isPending: boolean;
  onOpen: () => void;
  onClose: () => void;
  onToggleOpen: () => void;
  onPending: () => void;
  onCompleted: () => void;
};

export const useChatBar = create<ChatBarState>((set) => ({
  open: false,
  isPending: false,
  onOpen: () => set({ open: true }),
  onClose: () => set({ open: false }),
  onToggleOpen: () => set((state) => ({ open: !state.open })),
  onPending: () => set({ isPending: true }),
  onCompleted: () => set({ isPending: false }),
}));
