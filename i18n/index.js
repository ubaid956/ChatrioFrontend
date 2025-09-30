import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import translation files
import en from './locales/en/translation.json';
import ar from './locales/ar/translation.json';

const DEFAULT_LANG = 'en';

// Synchronous init with default language
i18n
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',
    lng: DEFAULT_LANG,
    fallbackLng: DEFAULT_LANG,
    resources: {
      en: { translation: en },
      ar: { translation: ar },
    },
    interpolation: {
      escapeValue: false,
    },
  });

// Utility to set language and persist
export const setAppLanguage = async (lang) => {
  await i18n.changeLanguage(lang);
  await AsyncStorage.setItem('appLanguage', lang);
};

// Utility to load language from storage and switch if needed
export const loadLanguage = async () => {
  try {
    const storedLang = await AsyncStorage.getItem('appLanguage');
    if (storedLang && storedLang !== DEFAULT_LANG) {
      await i18n.changeLanguage(storedLang);
    }
  } catch { }
};

export default i18n;
