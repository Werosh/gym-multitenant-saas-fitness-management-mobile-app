/** MyGymHere brand palette */
export const brand = {
  green: '#A2FF00',
  greenDark: '#8AE600',
  greenMuted: 'rgba(162, 255, 0, 0.15)',
  black: '#000000',
  charcoal: '#0A0A0A',
  surface: '#121212',
  card: '#161616',
  elevated: '#1C1C1C',
  white: '#FFFFFF',
  gray: '#B0B0B0',
  grayMuted: '#6B6B6B',
};

export const colors = {
  light: {
    primary: brand.green,
    primaryDark: brand.greenDark,
    accent: brand.green,
    secondary: brand.grayMuted,
    background: '#F5F5F5',
    surface: '#FFFFFF',
    card: '#FFFFFF',
    elevated: '#FAFAFA',
    text: brand.black,
    textSecondary: '#555555',
    textMuted: '#888888',
    border: '#E0E0E0',
    borderSubtle: '#EEEEEE',
    error: '#FF4444',
    warning: '#FFB020',
    success: '#2D8A4E',
    tabBar: '#FFFFFF',
    tabBarInactive: '#999999',
    overlay: 'rgba(0, 0, 0, 0.04)',
    onPrimary: brand.black,
  },
  dark: {
    primary: brand.green,
    primaryDark: brand.greenDark,
    accent: brand.green,
    secondary: brand.gray,
    background: brand.black,
    surface: brand.surface,
    card: brand.card,
    elevated: brand.elevated,
    text: brand.white,
    textSecondary: brand.gray,
    textMuted: brand.grayMuted,
    border: '#2A2A2A',
    borderSubtle: '#1E1E1E',
    error: '#FF5555',
    warning: '#FFB020',
    success: brand.green,
    tabBar: brand.black,
    tabBarInactive: brand.grayMuted,
    overlay: brand.greenMuted,
    onPrimary: brand.black,
  },
};

export type ThemeColors = typeof colors.dark;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
};

export const typography = {
  h1: { fontSize: 32, fontWeight: '800' as const, letterSpacing: -0.8 },
  h2: { fontSize: 24, fontWeight: '700' as const, letterSpacing: -0.4 },
  h3: { fontSize: 17, fontWeight: '600' as const, letterSpacing: -0.2 },
  body: { fontSize: 15, fontWeight: '400' as const, lineHeight: 22 },
  caption: { fontSize: 13, fontWeight: '400' as const, lineHeight: 18 },
  small: { fontSize: 11, fontWeight: '500' as const, letterSpacing: 0.6 },
  label: { fontSize: 11, fontWeight: '600' as const, letterSpacing: 1.2, textTransform: 'uppercase' as const },
  stat: { fontSize: 28, fontWeight: '700' as const, letterSpacing: -0.5 },
};

export const layout = {
  screenPadding: 20,
  cardGap: 12,
  maxContentWidth: 480,
};
