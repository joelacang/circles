import { LucideIcon } from "lucide-react";
import { MODE } from "./enum";
import { Id } from "../../convex/_generated/dataModel";

export type ModeDisplay = {
  mode: MODE;
  color: string;
  icon: LucideIcon;
  light: string;
  dark: string;
};

export type ImageDetails = {
  width: number;
  height: number;
  size: number;
  type: string;
};

export type AttachmentDetail = {
  storageId: Id<"_storage">;
  details?: ImageDetails;
};
