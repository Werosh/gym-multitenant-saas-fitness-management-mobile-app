import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeColors, colors } from '../config/theme';

type ThemeMode = 'light' | 'dark';

interface ThemeState {
  mode: ThemeMode;
  colors: ThemeColors;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
  hydrate: () => Promise<void>;
}

const STORAGE_KEY = '@mygymhere_theme';

export const useThemeStore = create<ThemeState>((set, get) => ({
  mode: 'dark',
  colors: colors.dark,

  toggleTheme: () => {
    const next = get().mode === 'dark' ? 'light' : 'dark';
    set({ mode: next, colors: colors[next] });
    AsyncStorage.setItem(STORAGE_KEY, next);
  },

  setTheme: (mode) => {
    set({ mode, colors: colors[mode] });
    AsyncStorage.setItem(STORAGE_KEY, mode);
  },

  hydrate: async () => {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') {
      set({ mode: stored, colors: colors[stored] });
    }
  },
}));
