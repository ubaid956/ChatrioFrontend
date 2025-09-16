import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import translation files
import en from './locales/en/translation.json';
import ar from './locales/ar/translation.json';

const DEFAULT_LANG = 'en';

// Function to load saved language
const loadLanguage = async () => {
  try {
    const storedLang = await AsyncStorage.getItem('appLanguage');
    return storedLang || DEFAULT_LANG;
  } catch {
    return DEFAULT_LANG;
  }
};

(async () => {
  const savedLang = await loadLanguage();

  i18n
    .use(initReactI18next)
    .init({
      compatibilityJSON: 'v3',
      lng: savedLang,
      fallbackLng: DEFAULT_LANG,
      resources: {
        en: { translation: en },
        ar: { translation: ar },
      },
      interpolation: {
        escapeValue: false,
      },
    });
})();

export default i18n;
