import { LocalFile } from "../types";
import AttachmentPreview from "./attachment-preview";

interface Props {
  files: LocalFile[];
  onFilesChanged: (files: LocalFile[]) => void;
}
const AttachmentPreviewSection = ({ files, onFilesChanged }: Props) => {
  const handleRemoveFile = (url: string) => {
    const updatedFiles = files.filter((f) => f.url !== url);

    onFilesChanged(updatedFiles);
  };

  return (
    <div className=" p-2">
      <div className="flex flex-row flex-wrap gap-2">
        {files.map((file) => (
          <AttachmentPreview
            key={file.url}
            file={file}
            onFileRemoved={handleRemoveFile}
          />
        ))}
      </div>
    </div>
  );
};

export default AttachmentPreviewSection;
