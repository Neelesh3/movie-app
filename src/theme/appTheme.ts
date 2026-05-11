/**
 * Semantic OTT palette for CineBluish.
 * Light mode avoids pure #FFFFFF for large surfaces.
 */

export type AppThemeColors = {
  background: string;
  surface: string;
  surfaceMuted: string;
  textPrimary: string;
  textSecondary: string;
  accent: string;
  accentMuted: string;
  borderSubtle: string;
  chipBackground: string;
  chipText: string;
  overlayScrim: string;
  /** Area behind native video controls / letterbox */
  videoBackdrop: string;
  onAccent: string;
};

const dark: AppThemeColors = {
  background: '#0B1020',
  surface: '#151C2E',
  surfaceMuted: '#1B2236',
  textPrimary: '#FFFFFF',
  textSecondary: '#A8B3CF',
  accent: '#4DA2FF',
  accentMuted: '#3B82C4',
  borderSubtle: 'rgba(255,255,255,0.08)',
  chipBackground: '#151C2E',
  chipText: '#FFFFFF',
  overlayScrim: 'rgba(0,0,0,0.5)',
  videoBackdrop: '#000000',
  onAccent: '#FFFFFF',
};

const light: AppThemeColors = {
  background: '#E4E8F0',
  surface: '#E8EDF5',
  surfaceMuted: '#DDE4EF',
  textPrimary: '#121A2C',
  textSecondary: '#4A5568',
  accent: '#2A7EDE',
  accentMuted: '#256BB8',
  borderSubtle: 'rgba(17,24,39,0.1)',
  chipBackground: '#D4DCE8',
  chipText: '#1A2233',
  overlayScrim: 'rgba(15,23,42,0.45)',
  videoBackdrop: '#0A0D14',
  onAccent: '#FFFFFF',
};

export function getAppThemeColors(
  darkMode: boolean
): AppThemeColors {
  return darkMode ? dark : light;
}
