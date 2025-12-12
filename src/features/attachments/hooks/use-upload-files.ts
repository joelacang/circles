import { useMutation } from "convex/react";
import { Id } from "../../../../convex/_generated/dataModel";
import { useState } from "react";
import { api } from "../../../../convex/_generated/api";
import { AttachmentDetail } from "@/types";
import { useGetImageDimensions } from "@/hooks/use-get-image-dimensions";

export const useUploadFiles = () => {
  const uploadUrlFn = useMutation(api.storage.generateUploadURL);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const { getImageDimensions } = useGetImageDimensions();

  const uploadFiles = async (
    files: File[]
  ): Promise<{
    success: boolean;
    attachments: AttachmentDetail[];
  }> => {
    setUploading(true);

    const fileUploadPromises: Promise<AttachmentDetail | null>[] = files.map(
      async (file) => {
        const uploadUrl = await uploadUrlFn();

        try {
          if (!uploadUrl) {
            setError(`Can't generate upload url for file: ${file.name}`);
            return null;
          }

          const result = await fetch(uploadUrl, {
            method: "POST",
            headers: {
              "Content-Type": file.type,
            },
            body: file,
          });

          if (!result.ok) {
            setError(`Can't upload file: ${file.name}`);

            return null;
          }

          const { storageId } = await result.json();

          if (file.type.startsWith(`image/`)) {
            const details = await getImageDimensions(file);

            return { details, storageId: storageId as Id<"_storage"> };
          }

          return { storageId: storageId as Id<"_storage"> };
        } catch (error) {
          setError(`Error uploading file. ${error}`);
          return null;
        }
      }
    );

    const results = await Promise.all(fileUploadPromises);
    const attachments = results.filter((result) => result !== null);

    setUploading(false);

    return {
      success: attachments.length === files.length,
      attachments,
    };
  };

  return { uploadFiles, uploading, error };
};
