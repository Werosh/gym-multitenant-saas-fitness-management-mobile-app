import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeStore } from '../../stores/themeStore';
import { layout, spacing } from '../../config/theme';

interface AuthLayoutProps {
  children: React.ReactNode;
  footer?: React.ReactNode;
  headline?: string;
  subline?: string;
  style?: ViewStyle;
}

export function BrandMark({ compact = false }: { compact?: boolean }) {
  const colors = useThemeStore((s) => s.colors);
  return (
    <View style={styles.brandMark}>
      <View style={[styles.markBar, { backgroundColor: colors.primary }, compact && styles.markBarCompact]} />
      <Text style={[styles.brandText, { color: colors.text }, compact && styles.brandTextCompact]}>
        GYM<Text style={{ color: colors.primary }}>HUB</Text>
      </Text>
    </View>
  );
}

export function AuthLayout({ children, footer, headline, subline, style }: AuthLayoutProps) {
  const colors = useThemeStore((s) => s.colors);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
      <View style={[styles.inner, style]}>
        <BrandMark />
        {(headline || subline) && (
          <View style={styles.intro}>
            {headline && (
              <Text style={[styles.headline, { color: colors.text }]}>{headline}</Text>
            )}
            {subline && (
              <Text style={[styles.subline, { color: colors.textSecondary }]}>{subline}</Text>
            )}
          </View>
        )}
        <View style={styles.body}>{children}</View>
        {footer && <View style={styles.footer}>{footer}</View>}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  inner: {
    flex: 1,
    paddingHorizontal: layout.screenPadding,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  intro: {
    marginBottom: spacing.lg,
  },
  headline: {
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: -0.4,
    marginBottom: spacing.xs,
  },
  subline: {
    fontSize: 15,
    lineHeight: 22,
  },
  body: { flex: 1 },
  footer: { paddingTop: spacing.sm },
  brandMark: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: spacing.xl,
  },
  markBar: {
    width: 3,
    height: 32,
    borderRadius: 2,
  },
  markBarCompact: {
    height: 24,
  },
  brandText: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 2,
  },
  brandTextCompact: {
    fontSize: 18,
  },
});
