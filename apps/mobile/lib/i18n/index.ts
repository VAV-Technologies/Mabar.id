import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

import en from './locales/en';
import id from './locales/id';

import { STORAGE_KEYS, DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES } from '@mabar/shared/constants';
import type { Language } from '@mabar/shared/types';

// Language detection plugin
const languageDetectorPlugin = {
  type: 'languageDetector' as const,
  async: true,
  detect: async (callback: (lang: string) => void) => {
    try {
      // Check stored preference first
      const storedLang = await AsyncStorage.getItem(STORAGE_KEYS.USER_LANGUAGE);
      if (storedLang && SUPPORTED_LANGUAGES.includes(storedLang as Language)) {
        callback(storedLang);
        return;
      }

      // Fall back to device language
      const deviceLang = Localization.getLocales()[0]?.languageCode || 'en';
      const supportedLang = SUPPORTED_LANGUAGES.includes(deviceLang as Language)
        ? deviceLang
        : DEFAULT_LANGUAGE;
      callback(supportedLang);
    } catch {
      callback(DEFAULT_LANGUAGE);
    }
  },
  init: () => {},
  cacheUserLanguage: async (language: string) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_LANGUAGE, language);
    } catch (error) {
      console.error('Error caching language:', error);
    }
  },
};

i18n
  .use(languageDetectorPlugin)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      id: { translation: id },
    },
    fallbackLng: DEFAULT_LANGUAGE,
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

// Helper to change language
export const changeLanguage = async (lang: Language) => {
  await i18n.changeLanguage(lang);
  await AsyncStorage.setItem(STORAGE_KEYS.USER_LANGUAGE, lang);
};

// Get current language
export const getCurrentLanguage = (): Language => i18n.language as Language;

export default i18n;
