import i18n from "@/i18n";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { languages } from "./resources";

const LanguageSwitcher = () => {
  return (
    <Select value={i18n.language} onValueChange={(e) => i18n.changeLanguage(e)}>
      <SelectTrigger>
        <SelectValue placeholder={i18n.language} />
      </SelectTrigger>
      <SelectContent>
        {languages.map((l) => (
          <SelectItem key={l.code} value={l.code}>
            {l.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default LanguageSwitcher;
