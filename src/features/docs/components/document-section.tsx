import { useTranslation } from "react-i18next";
import { Section } from "../types";
import DocumentContent from "./document-content";

interface Props {
  section: Section;
}
const DocumentSection = ({ section }: Props) => {
  const { t } = useTranslation();

  return (
    <div>
      <p className="text-xl font-semibold">{t(section.heading)}</p>
      {Array.isArray(section.content) ? (
        <div>
          {section.content.map((content, index) => (
            <DocumentContent key={index} content={content} />
          ))}
        </div>
      ) : (
        <DocumentContent content={section.content} />
      )}
    </div>
  );
};

export default DocumentSection;
