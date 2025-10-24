import usersEN from "../features/users/locales/en.json";
import usersCN from "../features/users/locales/cn.json";
import usersES from "../features/users/locales/es.json";
import usersFR from "../features/users/locales/fr.json";
import usersJP from "../features/users/locales/jp.json";
import usersRU from "../features/users/locales/ru.json";
import sidebarEN from "../features/sidebar/locales/en.json";
import sidebarCN from "../features/sidebar/locales/cn.json";
import sidebarES from "../features/sidebar/locales/es.json";
import sidebarFR from "../features/sidebar/locales/fr.json";
import sidebarJP from "../features/sidebar/locales/jp.json";
import sidebarRU from "../features/sidebar/locales/ru.json";
import postsEN from "../features/posts/locales/en.json";
import postsJP from "../features/posts/locales/jp.json";
import postsES from "../features/posts/locales/es.json";
import postsFR from "../features/posts/locales/fr.json";
import postsCN from "../features/posts/locales/cn.json";
import postsRU from "../features/posts/locales/ru.json";
import docsEN from "../features/docs/locales/en.json";
import docsES from "../features/docs/locales/es.json";
import docsCN from "../features/docs/locales/cn.json";
import docsFR from "../features/docs/locales/fr.json";
import docsRU from "../features/docs/locales/ru.json";
import docsJP from "../features/docs/locales/jp.json";
import { LocalizationResource } from "@clerk/types";
import { enUS, esES, frFR, jaJP, ruRU, zhCN } from "@clerk/localizations";

export const resources = {
  es: {
    users: usersES,
    sidebar: sidebarES,
    posts: postsES,
    docs: docsES,
  },
  en: {
    users: usersEN,
    sidebar: sidebarEN,
    posts: postsEN,
    docs: docsEN,
  },
  fr: {
    users: usersFR,
    sidebar: sidebarFR,
    posts: postsFR,
    docs: docsFR,
  },
  cn: {
    users: usersCN,
    sidebar: sidebarCN,
    posts: postsCN,
    docs: docsCN,
  },
  jp: {
    users: usersJP,
    sidebar: sidebarJP,
    posts: postsJP,
    docs: docsJP,
  },
  ru: {
    users: usersRU,
    sidebar: sidebarRU,
    posts: postsRU,
    docs: docsRU,
  },
};

export const languages = [
  { code: "en", label: "English" },
  { code: "fr", label: "Français" },
  { code: "es", label: "Español" },
  { code: "jp", label: "日本語" },
  { code: "cn", label: "中文" },
  { code: "ru", label: "Русский" },
];

export const clerkLocale: Record<string, LocalizationResource> = {
  en: enUS,
  es: esES,
  jp: jaJP,
  ru: ruRU,
  cn: zhCN,
  fr: frFR,
};
