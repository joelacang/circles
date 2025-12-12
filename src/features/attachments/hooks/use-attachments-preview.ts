import { create } from "zustand";

type AttachmentItem = {
  file: File;
  url: string;
};
type AttachmentsPreviewState = {
  open: boolean;
  pending: boolean;
  files: AttachmentItem[];
  onOpen: () => void;
  onClose: () => void;
  onPending: () => void;
  onCompleted: () => void;
  onAddFiles: (items: File[]) => void;
  onRemoveFile: (url: string) => void;
};

export const useAttachmentPreview = create<AttachmentsPreviewState>((set) => ({
  open: false,
  pending: false,
  files: [],
  onOpen: () => set({ open: true }),
  onClose: () =>
    set((state) => {
      state.files.forEach((f) => URL.revokeObjectURL(f.url));
      return {
        open: false,
        files: [],
      };
    }),
  onPending: () => set({ pending: true }),
  onCompleted: () => set({ pending: false }),
  onAddFiles: (files) =>
    set((state) => ({
      files: [
        ...state.files,
        ...files.map((f) => ({
          file: f,
          url: URL.createObjectURL(f),
        })),
      ],
    })),
  onRemoveFile: (url) =>
    set((state) => {
      const target = state.files.find((f) => f.url === url);

      if (target) URL.revokeObjectURL(target.url);

      return {
        files: state.files.filter((f) => f.url !== url),
      };
    }),
}));
