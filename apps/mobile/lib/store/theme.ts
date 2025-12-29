import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Theme } from '@mabar/shared/types';
import { DEFAULT_THEME, STORAGE_KEYS } from '@mabar/shared/constants';

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: DEFAULT_THEME,
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: STORAGE_KEYS.USER_THEME,
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
