import type { LucideIcon } from "lucide-react";
import { create } from "zustand";

type ConfirmAlertFormType = {
  title: string;
  message: string;
  icon: LucideIcon;
  mode: "default" | "destructive";
  enableConfirmation: boolean;
  action: () => void;
  destruct?: () => void;
  actionLabel?: string;
  cancelLabel?: string;
  destructLabel?: string;
  children?: () => React.ReactNode;
};

type ConfirmDialogState = {
  confirmDetails: ConfirmAlertFormType | null;
  open: boolean;
  confirmCode: string | null;
  error: string | null;
  isError: boolean;
  isPending: boolean;
  isCompleted: boolean;
  onOpen: (details: ConfirmAlertFormType) => void;
  onClose: () => void;
  onValidate: (code?: string | null) => boolean;
  onConfirm: () => boolean;
  onDestruct: () => void;
  onError: (error: string | null) => void;
  onPending: () => void;
  onCompleted: () => void;
  onReset: () => void;
};

export const useConfirmationAlert = create<ConfirmDialogState>((set) => ({
  confirmDetails: null,
  open: false,
  confirmCode: null,
  error: null,
  isError: false,
  isPending: false,
  isCompleted: false,
  onOpen: (confirmDetails) => {
    const confirmCode = confirmDetails.enableConfirmation
      ? Math.floor(100000 + Math.random() * 900000).toString()
      : null;
    set({
      confirmDetails,
      open: true,
      confirmCode,
      error: null,
      isError: false,
      isPending: false,
      isCompleted: false,
    });
  },
  onClose: () =>
    set({
      confirmDetails: null,
      open: false,
      error: null,
      isError: false,
      isPending: false,
      confirmCode: null,
      isCompleted: false,
    }),
  onValidate: (code) => {
    const state: ConfirmDialogState = useConfirmationAlert.getState();

    // Check if confirmation is required and validate code
    if (state.confirmDetails?.enableConfirmation) {
      return code === state.confirmCode;
    }

    return true;
  },
  onConfirm: () => {
    const state: ConfirmDialogState = useConfirmationAlert.getState();
    const action = state.confirmDetails?.action;

    if (!action) return false;

    set({ isPending: true });

    try {
      action();

      set({ isPending: false, isCompleted: true, open: false });

      return true;
    } catch (error) {
      console.error(error);
      set({
        isPending: false,
        isError: true,
        error: "An error occurred. Please try again.",
      });
      return false;
    }
  },
  onDestruct: () => {
    const state: ConfirmDialogState = useConfirmationAlert.getState();
    const destruct = state.confirmDetails?.destruct;

    if (!destruct) return;

    set({ isPending: true });

    try {
      destruct();

      set({
        isPending: false,
        isCompleted: true,
        open: false,
      });
    } catch (error) {
      console.error(error);
      set({
        isPending: false,
        isError: true,
        error: "An error occurred. Please try again.",
      });
    }
  },
  onError: (error) => set({ isError: true, error }),
  onPending: () => set({ isPending: true }),
  onCompleted: () =>
    set({
      isPending: false,
      isCompleted: true,
      open: false,
    }),
  onReset: () =>
    set({
      isPending: false,
      isCompleted: false,
      open: false,
      confirmDetails: null,
      error: null,
      isError: false,
      confirmCode: null,
    }),
}));
