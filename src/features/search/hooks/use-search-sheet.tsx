import { create } from "zustand";

type SearchSheetState = {
  open: boolean;
  pending: boolean;
  onOpen: () => void;
  onClose: () => void;
  onPending: () => void;
  onCompleted: () => void;
};

export const useSearchSheet = create<SearchSheetState>((set) => ({
  open: false,
  pending: false,
  onOpen: () => set({ open: true }),
  onClose: () => set({ open: false }),
  onPending: () => set({ pending: true }),
  onCompleted: () => set({ pending: false }),
}));
