import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import { resources } from "./resources";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    ns: ["users", "sidebar", "posts", "docs", "notifications"],
    defaultNS: "users",
    detection: {
      order: ["localStorage", "navigator", "htmlTag"],
      caches: ["localStorage"], // save selected language to localStorage
    },
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;
