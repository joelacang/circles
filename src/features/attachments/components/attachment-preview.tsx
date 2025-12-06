import CloseButton from "@/components/close-button";
import Image from "next/image";
import { LocalFile } from "../types";

interface Props {
  file: LocalFile;
  onFileRemoved?: (url: string) => void;
}
const AttachmentPreview = ({ file, onFileRemoved }: Props) => {
  return (
    <div className="relative rounded-xl overflow-hidden">
      <div className=" relative size-24 aspect-square">
        <Image src={file.url} alt="Sample" fill className="object-cover" />
      </div>
      <div className="absolute top-2 right-2">
        <CloseButton
          tooltip="Remove"
          className="bg-black/60 dark:bg-black/60 hover:bg-black/60 hover:dark:bg-black/60"
          variant="outline"
          iconColor="#ffffff"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            if (onFileRemoved) {
              onFileRemoved(file.url);
            }
          }}
        />
      </div>
    </div>
  );
};

export default AttachmentPreview;
