export const colors = {
  light: {
    primary: '#2563EB',
    primaryDark: '#1D4ED8',
    secondary: '#10B981',
    background: '#F8FAFC',
    surface: '#FFFFFF',
    card: '#FFFFFF',
    text: '#0F172A',
    textSecondary: '#64748B',
    border: '#E2E8F0',
    error: '#EF4444',
    warning: '#F59E0B',
    success: '#10B981',
    tabBar: '#FFFFFF',
    tabBarInactive: '#94A3B8',
  },
  dark: {
    primary: '#3B82F6',
    primaryDark: '#2563EB',
    secondary: '#34D399',
    background: '#0F172A',
    surface: '#1E293B',
    card: '#1E293B',
    text: '#F8FAFC',
    textSecondary: '#94A3B8',
    border: '#334155',
    error: '#F87171',
    warning: '#FBBF24',
    success: '#34D399',
    tabBar: '#1E293B',
    tabBarInactive: '#64748B',
  },
};

export type ThemeColors = typeof colors.light;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
};

export const typography = {
  h1: { fontSize: 28, fontWeight: '700' as const },
  h2: { fontSize: 22, fontWeight: '600' as const },
  h3: { fontSize: 18, fontWeight: '600' as const },
  body: { fontSize: 16, fontWeight: '400' as const },
  caption: { fontSize: 14, fontWeight: '400' as const },
  small: { fontSize: 12, fontWeight: '400' as const },
};
