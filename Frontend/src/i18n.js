import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enTranslation from './locales/en/translation.json';
import bnTranslation from './locales/bn/translation.json';

const resources = {
  en: { translation: enTranslation },
  bn: { translation: bnTranslation }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // Setting Bengali as the default language based on your design
    fallbackLng: 'bn', // Fallback to Bengali if English translations are missing
    interpolation: {
      escapeValue: false // React already escapes values to prevent XSS
    }
  });

export default i18n;