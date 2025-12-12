import { create } from "zustand";

type DocumentDialogState = {
  type: "privacy" | "tos" | null;
  open: boolean;
  onOpen: (type: "privacy" | "tos") => void;
  onClose: () => void;
};

export const useDocumentDialog = create<DocumentDialogState>((set) => ({
  type: null,
  open: false,
  onOpen: (type) => set({ open: true, type }),
  onClose: () => set({ open: false, type: null }),
}));
