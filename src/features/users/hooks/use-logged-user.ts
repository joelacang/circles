import { create } from "zustand";
import { UserPreview } from "../types";

type LoggedUserState = {
  loggedUser: UserPreview | null;
  onAdd: (loggedUSer: UserPreview) => void;
  onRemove: () => void;
};

export const useLoggedUser = create<LoggedUserState>((set) => ({
  loggedUser: null,
  onAdd: (loggedUser) => set({ loggedUser }),
  onRemove: () => set({ loggedUser: null }),
}));
