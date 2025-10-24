import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTranslation } from "react-i18next";
import { useDocumentDialog } from "../hooks/use-document-dialog";
import { Document } from "../types";
import DocumentSection from "./document-section";

const DocumentDialog = () => {
  const { t } = useTranslation();
  const { type, open, onClose } = useDocumentDialog();

  const document = t(
    type === "privacy"
      ? "docs:policies.privacy_policy"
      : "docs:policies.terms_of_service",
    { returnObjects: true }
  ) as Document;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t(document.title)}</DialogTitle>
          <DialogDescription>{t("docs:last_updated")}</DialogDescription>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-y-auto">
          <div className="space-y-6 px-4">
            {document.sections.map((section, index) => (
              <DocumentSection key={index} section={section} />
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentDialog;
