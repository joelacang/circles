import { ImageDetails } from "@/types";
import { useCallback } from "react";

export function useGetImageDimensions() {
  const getImageDimensions = useCallback(
    (file: File): Promise<ImageDetails> => {
      return new Promise((resolve, reject) => {
        const url = URL.createObjectURL(file);
        const img = new Image();

        img.onload = () => {
          const dimensions = {
            width: img.width,
            height: img.height,
            size: file.size,
            type: file.type,
          };
          URL.revokeObjectURL(url);
          resolve(dimensions);
        };

        img.onerror = () => {
          URL.revokeObjectURL(url);
          reject(new Error("Failed to load image"));
        };

        img.src = url;
      });
    },
    []
  );

  return { getImageDimensions };
}
