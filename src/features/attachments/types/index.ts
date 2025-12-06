import { Id } from "../../../../convex/_generated/dataModel";

export type LocalFile = {
  file: File;
  url: string;
};

export type Attachment = {
  id: Id<"postAttachments">;
  storageId: Id<"_storage">;
  url: string;
};
