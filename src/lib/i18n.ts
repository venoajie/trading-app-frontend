// src/lib/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import translationEN from '@/locales/en/translation.json';

// This is the i18next configuration file.
// It sets up the library with initial settings for language detection,
// resources (translation files), and integration with React.
// Per Pillar 2, this establishes the foundation for all future UI text.

i18n
  // Detect user language
  .use(LanguageDetector)
  // Pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // Init i18next
  .init({
    debug: import.meta.env.DEV, // Enable debug mode in development
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React already safes from xss
    },
    resources: {
      en: {
        translation: translationEN,
      },
    },
  });

export default i18n;
