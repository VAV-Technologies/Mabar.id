import type { Language, Theme, PlaceCategory } from '../types';

// Supported languages
export const SUPPORTED_LANGUAGES: Language[] = ['en', 'id'];
export const DEFAULT_LANGUAGE: Language = 'en';

// Supported themes
export const SUPPORTED_THEMES: Theme[] = ['dark', 'light', 'cream'];
export const DEFAULT_THEME: Theme = 'dark';

// Place categories
export const PLACE_CATEGORIES: PlaceCategory[] = ['cafe', 'restaurant', 'bar', 'bakery'];

// Spin configuration
export const SPIN_CONFIG = {
  DEFAULT_MAX_DAILY_SPINS: 3,
  DEFAULT_RADIUS_KM: 3,
  MIN_RADIUS_KM: 1,
  MAX_RADIUS_KM: 10,
  RADIUS_OPTIONS: [1, 3, 5, 10],
} as const;

// Voucher configuration
export const VOUCHER_CONFIG = {
  DEFAULT_VALIDITY_HOURS: 24,
  CODE_LENGTH: 12,
  WARNING_HOURS_BEFORE_EXPIRY: 2,
} as const;

// App configuration
export const APP_CONFIG = {
  NAME: 'Mabar',
  TAGLINE_EN: 'Spin. Discover. Feast.',
  TAGLINE_ID: 'Putar. Temukan. Nikmati.',
  VERSION: '1.0.0',
} as const;

// Storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: '@mabar/auth-token',
  USER_LANGUAGE: '@mabar/language',
  USER_THEME: '@mabar/theme',
  ONBOARDING_COMPLETED: '@mabar/onboarding-completed',
} as const;

// Route names
export const ROUTES = {
  // Auth
  LOGIN: '/(auth)/login',
  REGISTER: '/(auth)/register',
  FORGOT_PASSWORD: '/(auth)/forgot-password',
  // Tabs
  HOME: '/(tabs)',
  MAP: '/(tabs)/map',
  SPIN: '/(tabs)/spin',
  WALLET: '/(tabs)/wallet',
  PROFILE: '/(tabs)/profile',
  // Other
  ONBOARDING: '/onboarding',
  PLACE_DETAIL: '/place/[id]',
  VOUCHER_DETAIL: '/voucher/[id]',
} as const;
