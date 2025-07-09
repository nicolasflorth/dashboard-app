import i18n from "i18next";
import intervalPlural from "i18next-intervalplural-postprocessor";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import HttpBackend from 'i18next-http-backend';

export const defaultNS = 'common';

const DETECTION_OPTIONS = {
  order: ['localStorage', 'navigator'],
  caches: ['localStorage'],
};

i18n
  .use(HttpBackend) // loads translations via HTTP (from /public/locales)
  .use(LanguageDetector)
  .use(intervalPlural)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    ns: [
      'common'
    ],
    defaultNS: "common",
    detection: DETECTION_OPTIONS,
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: true, // enable Suspense
    },
    backend: {
      // The default path for translation files
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
  });

export default i18n;