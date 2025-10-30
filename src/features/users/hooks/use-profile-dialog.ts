import { Profile } from "@/features/profiles/types";
import { create } from "zustand";

type ProfileDialogState = {
  isOpen: boolean;
  isPending: boolean;
  profile: Profile | null;
  onOpen: () => void;
  onOpenProfile: (profile: Profile) => void;
  onClose: () => void;
  onPending: () => void;
  onCompleted: () => void;
};

export const useProfileDialog = create<ProfileDialogState>((set) => ({
  isOpen: false,
  isPending: false,
  profile: null,
  onOpen: () => set({ isOpen: true }),
  onOpenProfile: (profile) => set({ isOpen: true, profile }),
  onClose: () => set({ isOpen: false, profile: null }),
  onPending: () => set({ isPending: true }),
  onCompleted: () => set({ isPending: false }),
}));
