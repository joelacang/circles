import { UserPreview } from "@/features/users/types";
import { create } from "zustand";

type FollowDialogData = {
  user: UserPreview;
  mode: "followers" | "following";
  count: number;
};

type FollowDialogState = {
  data: FollowDialogData | null;
  open: boolean;
  isPending: boolean;
  onOpen: (data: FollowDialogData) => void;
  onClose: () => void;
  onPending: () => void;
  onCompleted: () => void;
};

export const useFollowDialog = create<FollowDialogState>((set) => ({
  data: null,
  open: false,
  isPending: false,
  onOpen: (data) => set({ data, open: true }),
  onClose: () => set({ data: null, open: false, isPending: false }),
  onPending: () => set({ isPending: true }),
  onCompleted: () => set({ isPending: false }),
}));
