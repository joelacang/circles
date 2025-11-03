import { create } from "zustand";

create;

type NotificationSheetState = {
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useNotificationSheet = create<NotificationSheetState>((set) => ({
  open: false,
  onOpen: () => set({ open: true }),
  onClose: () => set({ open: false }),
}));
