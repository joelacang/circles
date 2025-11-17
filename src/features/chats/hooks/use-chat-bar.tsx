import { create } from "zustand";
import { ChatDetail } from "../types";

type ChatBarState = {
  open: boolean;
  isPending: boolean;
  mode: "list" | "room";
  room: ChatDetail | null;
  onOpen: () => void;
  onOpenChat: (room: ChatDetail) => void;
  onClose: () => void;
  onReturn: () => void;
  onToggleOpen: () => void;
  onPending: () => void;
  onCompleted: () => void;
};

export const useChatBar = create<ChatBarState>((set) => ({
  open: false,
  isPending: false,
  mode: "list",
  room: null,
  onOpen: () => set({ open: true }),
  onClose: () => set({ open: false }),
  onReturn: () => set({ mode: "list", room: null }),
  onOpenChat: (room) => set({ open: true, room, mode: "room" }),
  onToggleOpen: () => set((state) => ({ open: !state.open })),
  onPending: () => set({ isPending: true }),
  onCompleted: () => set({ isPending: false }),
}));
