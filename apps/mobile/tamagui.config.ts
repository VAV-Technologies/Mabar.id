import { createTamagui, createTokens } from 'tamagui';
import { createInterFont } from '@tamagui/font-inter';
import { shorthands } from '@tamagui/shorthands';
import { themes as defaultThemes, tokens as defaultTokens } from '@tamagui/themes';
import { createMedia } from '@tamagui/react-native-media-driver';

// Create Inter font
const interFont = createInterFont();

// Custom color tokens
const customColors = {
  // Brand colors
  primary: '#FF6B35',
  primaryLight: '#FF8F5A',
  primaryDark: '#E55A2B',

  // Status colors
  success: '#22C55E',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',

  // Gray scale
  gray50: '#FAFAFA',
  gray100: '#F5F5F5',
  gray200: '#E5E5E5',
  gray300: '#D4D4D4',
  gray400: '#A3A3A3',
  gray500: '#737373',
  gray600: '#525252',
  gray700: '#404040',
  gray800: '#262626',
  gray900: '#171717',

  // Cream palette
  cream50: '#FFFBF5',
  cream100: '#FFF7EB',
  cream200: '#FFEFD6',
  cream300: '#FFE4BD',
  cream400: '#FFD699',
  cream500: '#F5C97A',
};

// Create tokens
const tokens = createTokens({
  ...defaultTokens,
  color: {
    ...defaultTokens.color,
    ...customColors,
  },
});

// Dark theme
const darkTheme = {
  background: '#0A0A0A',
  backgroundHover: '#1A1A1A',
  backgroundPress: '#262626',
  backgroundFocus: '#1A1A1A',
  backgroundStrong: '#000000',
  backgroundTransparent: 'rgba(0,0,0,0)',

  color: '#FFFFFF',
  colorHover: '#F5F5F5',
  colorPress: '#E5E5E5',
  colorFocus: '#F5F5F5',
  colorTransparent: 'rgba(255,255,255,0)',

  borderColor: '#262626',
  borderColorHover: '#404040',
  borderColorFocus: '#525252',
  borderColorPress: '#404040',

  placeholderColor: '#737373',

  // Semantic colors
  primary: '#FF6B35',
  primaryHover: '#FF8F5A',
  primaryPress: '#E55A2B',

  secondary: '#1A1A1A',
  secondaryHover: '#262626',
  secondaryPress: '#171717',

  success: '#22C55E',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',

  // Card backgrounds
  card: '#1A1A1A',
  cardHover: '#262626',

  // Surface colors
  surface: '#0F0F0F',
  surfaceHover: '#1A1A1A',

  // Text colors
  textPrimary: '#FFFFFF',
  textSecondary: '#A3A3A3',
  textMuted: '#737373',
};

// Light theme
const lightTheme = {
  background: '#FFFFFF',
  backgroundHover: '#F5F5F5',
  backgroundPress: '#E5E5E5',
  backgroundFocus: '#F5F5F5',
  backgroundStrong: '#FAFAFA',
  backgroundTransparent: 'rgba(255,255,255,0)',

  color: '#171717',
  colorHover: '#262626',
  colorPress: '#404040',
  colorFocus: '#262626',
  colorTransparent: 'rgba(0,0,0,0)',

  borderColor: '#E5E5E5',
  borderColorHover: '#D4D4D4',
  borderColorFocus: '#A3A3A3',
  borderColorPress: '#D4D4D4',

  placeholderColor: '#A3A3A3',

  // Semantic colors
  primary: '#FF6B35',
  primaryHover: '#E55A2B',
  primaryPress: '#CC4A20',

  secondary: '#F5F5F5',
  secondaryHover: '#E5E5E5',
  secondaryPress: '#D4D4D4',

  success: '#16A34A',
  warning: '#D97706',
  error: '#DC2626',
  info: '#2563EB',

  // Card backgrounds
  card: '#FFFFFF',
  cardHover: '#FAFAFA',

  // Surface colors
  surface: '#FAFAFA',
  surfaceHover: '#F5F5F5',

  // Text colors
  textPrimary: '#171717',
  textSecondary: '#525252',
  textMuted: '#737373',
};

// Cream theme
const creamTheme = {
  background: '#FFFBF5',
  backgroundHover: '#FFF7EB',
  backgroundPress: '#FFEFD6',
  backgroundFocus: '#FFF7EB',
  backgroundStrong: '#FFFFFF',
  backgroundTransparent: 'rgba(255,251,245,0)',

  color: '#3D3428',
  colorHover: '#4A4030',
  colorPress: '#5A4D3A',
  colorFocus: '#4A4030',
  colorTransparent: 'rgba(61,52,40,0)',

  borderColor: '#FFE4BD',
  borderColorHover: '#FFD699',
  borderColorFocus: '#F5C97A',
  borderColorPress: '#FFD699',

  placeholderColor: '#A69580',

  // Semantic colors
  primary: '#FF6B35',
  primaryHover: '#E55A2B',
  primaryPress: '#CC4A20',

  secondary: '#FFF7EB',
  secondaryHover: '#FFEFD6',
  secondaryPress: '#FFE4BD',

  success: '#16A34A',
  warning: '#D97706',
  error: '#DC2626',
  info: '#2563EB',

  // Card backgrounds
  card: '#FFFFFF',
  cardHover: '#FFFBF5',

  // Surface colors
  surface: '#FFF7EB',
  surfaceHover: '#FFEFD6',

  // Text colors
  textPrimary: '#3D3428',
  textSecondary: '#6B5D4D',
  textMuted: '#A69580',
};

// Create media queries
const media = createMedia({
  xs: { maxWidth: 660 },
  sm: { maxWidth: 800 },
  md: { maxWidth: 1020 },
  lg: { maxWidth: 1280 },
  xl: { maxWidth: 1420 },
  xxl: { maxWidth: 1600 },
  gtXs: { minWidth: 660 + 1 },
  gtSm: { minWidth: 800 + 1 },
  gtMd: { minWidth: 1020 + 1 },
  gtLg: { minWidth: 1280 + 1 },
  short: { maxHeight: 820 },
  tall: { minHeight: 820 },
  hoverNone: { hover: 'none' },
  pointerCoarse: { pointer: 'coarse' },
});

// Create Tamagui config
const config = createTamagui({
  defaultFont: 'body',
  shouldAddPrefersColorThemes: true,
  themeClassNameOnRoot: true,
  shorthands,
  fonts: {
    heading: interFont,
    body: interFont,
  },
  tokens,
  themes: {
    dark: darkTheme,
    light: lightTheme,
    cream: creamTheme,
    // Sub-themes for components
    dark_Button: {
      ...darkTheme,
      background: darkTheme.primary,
      backgroundHover: darkTheme.primaryHover,
      backgroundPress: darkTheme.primaryPress,
      color: '#FFFFFF',
    },
    light_Button: {
      ...lightTheme,
      background: lightTheme.primary,
      backgroundHover: lightTheme.primaryHover,
      backgroundPress: lightTheme.primaryPress,
      color: '#FFFFFF',
    },
    cream_Button: {
      ...creamTheme,
      background: creamTheme.primary,
      backgroundHover: creamTheme.primaryHover,
      backgroundPress: creamTheme.primaryPress,
      color: '#FFFFFF',
    },
  },
  media,
});

export type AppConfig = typeof config;

declare module 'tamagui' {
  interface TamaguiCustomConfig extends AppConfig {}
}

export default config;
