import usersEN from "../features/users/locales/en.json";
import usersCN from "../features/users/locales/cn.json";
import usersES from "../features/users/locales/es.json";
import usersFR from "../features/users/locales/fr.json";
import usersJP from "../features/users/locales/jp.json";
import usersRU from "../features/users/locales/ru.json";
import sidebarEN from "../features/navigation/locales/en.json";
import sidebarCN from "../features/navigation/locales/cn.json";
import sidebarES from "../features/navigation/locales/es.json";
import sidebarFR from "../features/navigation/locales/fr.json";
import sidebarJP from "../features/navigation/locales/jp.json";
import sidebarRU from "../features/navigation/locales/ru.json";
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
import notifEN from "../features/notifications/locales/en.json";
import notifES from "../features/notifications/locales/es.json";
import notifJP from "../features/notifications/locales/jp.json";
import notifFR from "../features/notifications/locales/fr.json";
import notifCN from "../features/notifications/locales/cn.json";
import notifRU from "../features/notifications/locales/ru.json";

import { LocalizationResource } from "@clerk/types";
import { enUS, esES, frFR, jaJP, ruRU, zhCN } from "@clerk/localizations";

export const resources = {
  es: {
    users: usersES,
    sidebar: sidebarES,
    posts: postsES,
    docs: docsES,
    notifications: notifES,
  },
  en: {
    users: usersEN,
    sidebar: sidebarEN,
    posts: postsEN,
    docs: docsEN,
    notifications: notifEN,
  },
  fr: {
    users: usersFR,
    sidebar: sidebarFR,
    posts: postsFR,
    docs: docsFR,
    notifications: notifFR,
  },
  cn: {
    users: usersCN,
    sidebar: sidebarCN,
    posts: postsCN,
    docs: docsCN,
    notifications: notifCN,
  },
  jp: {
    users: usersJP,
    sidebar: sidebarJP,
    posts: postsJP,
    docs: docsJP,
    notifications: notifJP,
  },
  ru: {
    users: usersRU,
    sidebar: sidebarRU,
    posts: postsRU,
    docs: docsRU,
    notifications: notifRU,
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
