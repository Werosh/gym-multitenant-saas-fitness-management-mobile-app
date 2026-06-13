export const colors = {
  light: {
    primary: '#C45208',
    primaryDark: '#9A3F06',
    accent: '#E8620C',
    secondary: '#5C5C58',
    background: '#F2F1EC',
    surface: '#FFFFFF',
    card: '#FFFFFF',
    elevated: '#FAFAF8',
    text: '#141413',
    textSecondary: '#6B6B65',
    textMuted: '#94948E',
    border: '#D8D7D0',
    borderSubtle: '#E8E7E1',
    error: '#C53030',
    warning: '#B7791F',
    success: '#2F7A4F',
    tabBar: '#FFFFFF',
    tabBarInactive: '#94948E',
    overlay: 'rgba(20, 20, 19, 0.04)',
  },
  dark: {
    primary: '#E8620C',
    primaryDark: '#C45208',
    accent: '#F07020',
    secondary: '#8A8A85',
    background: '#0B0B0C',
    surface: '#141416',
    card: '#1A1A1D',
    elevated: '#202024',
    text: '#EEEEE9',
    textSecondary: '#8A8A85',
    textMuted: '#5C5C58',
    border: '#2A2A2E',
    borderSubtle: '#222226',
    error: '#E05252',
    warning: '#D4A017',
    success: '#3D9A62',
    tabBar: '#0B0B0C',
    tabBarInactive: '#5C5C58',
    overlay: 'rgba(255, 255, 255, 0.04)',
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
  sm: 6,
  md: 8,
  lg: 12,
};

export const typography = {
  h1: { fontSize: 32, fontWeight: '800' as const, letterSpacing: -0.8 },
  h2: { fontSize: 24, fontWeight: '700' as const, letterSpacing: -0.4 },
  h3: { fontSize: 17, fontWeight: '600' as const, letterSpacing: -0.2 },
  body: { fontSize: 15, fontWeight: '400' as const, lineHeight: 22 },
  caption: { fontSize: 13, fontWeight: '400' as const, lineHeight: 18 },
  small: { fontSize: 11, fontWeight: '500' as const, letterSpacing: 0.6 },
  label: { fontSize: 11, fontWeight: '600' as const, letterSpacing: 1.1, textTransform: 'uppercase' as const },
  stat: { fontSize: 28, fontWeight: '700' as const, letterSpacing: -0.5 },
};

export const layout = {
  screenPadding: 20,
  cardGap: 12,
  maxContentWidth: 480,
};
