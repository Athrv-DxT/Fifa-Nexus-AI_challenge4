import { create } from 'zustand';
import type { SupportedLanguage } from '../../config/i18n';

interface PreferencesState {
  language: SupportedLanguage;
  highContrast: boolean;
  largeFont: boolean;
  reducedMotion: boolean;
  setLanguage: (lang: SupportedLanguage) => void;
  toggleHighContrast: () => void;
  toggleLargeFont: () => void;
  toggleReducedMotion: () => void;
}

export const usePreferencesStore = create<PreferencesState>((set) => ({
  language: 'en',
  highContrast: false,
  largeFont: false,
  reducedMotion: false,

  setLanguage: (lang) => {
    set({ language: lang });
    // Update HTML dir and lang properties for accessibility and RTL
    const root = document.documentElement;
    root.setAttribute('lang', lang);
    if (lang === 'ar') {
      root.setAttribute('dir', 'rtl');
    } else {
      root.setAttribute('dir', 'ltr');
    }
  },

  toggleHighContrast: () => {
    set((state) => {
      const active = !state.highContrast;
      if (active) {
        document.body.classList.add('high-contrast');
      } else {
        document.body.classList.remove('high-contrast');
      }
      return { highContrast: active };
    });
  },

  toggleLargeFont: () => {
    set((state) => {
      const active = !state.largeFont;
      if (active) {
        document.documentElement.style.fontSize = '120%';
      } else {
        document.documentElement.style.fontSize = '100%';
      }
      return { largeFont: active };
    });
  },

  toggleReducedMotion: () => {
    set((state) => {
      const active = !state.reducedMotion;
      return { reducedMotion: active };
    });
  }
}));
