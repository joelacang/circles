import { useTranslation } from "react-i18next";
import { Content } from "../types";

interface Props {
  content: Content;
}
const DocumentContent = ({ content }: Props) => {
  const { t } = useTranslation();
  return (
    <div>
      {content.title && <p className="font-semibold pt-4">{content.title}</p>}
      {content.items && content.items.length > 0 && (
        <ul className="list-disc pl-8 pt-2">
          {content.items.map((item, index) => (
            <li key={index}>{t(item)}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DocumentContent;
