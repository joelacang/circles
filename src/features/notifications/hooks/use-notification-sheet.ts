import { create } from "zustand";

type NotificationSheetState = {
  open: boolean;
  unread: number;
  onOpen: (unread: number) => void;
  onClose: () => void;
};

export const useNotificationSheet = create<NotificationSheetState>((set) => ({
  open: false,
  unread: 0,
  onOpen: (unread) => set({ open: true, unread }),
  onClose: () => set({ open: false, unread: 0 }),
}));
