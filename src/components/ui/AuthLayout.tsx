import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ViewStyle,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeStore } from '../../stores/themeStore';
import { useResponsive } from '../../hooks/useResponsive';
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
  const { horizontalPadding, isSmallPhone } = useResponsive();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={[
            styles.scroll,
            { paddingHorizontal: horizontalPadding },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.inner, style]}>
            <BrandMark compact={isSmallPhone} />
            {(headline || subline) && (
              <View style={styles.intro}>
                {headline && (
                  <Text
                    style={[
                      styles.headline,
                      { color: colors.text },
                      isSmallPhone && styles.headlineSmall,
                    ]}
                  >
                    {headline}
                  </Text>
                )}
                {subline && (
                  <Text style={[styles.subline, { color: colors.textSecondary }]}>{subline}</Text>
                )}
              </View>
            )}
            <View style={styles.body}>{children}</View>
            {footer && <View style={styles.footer}>{footer}</View>}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  flex: { flex: 1 },
  scroll: {
    flexGrow: 1,
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
    maxWidth: layout.maxContentWidth,
    width: '100%',
    alignSelf: 'center',
  },
  inner: {
    flexGrow: 1,
    minHeight: '100%',
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
  headlineSmall: {
    fontSize: 22,
  },
  subline: {
    fontSize: 15,
    lineHeight: 22,
  },
  body: { flexGrow: 1 },
  footer: { paddingTop: spacing.md },
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
  markBarCompact: { height: 24 },
  brandText: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 2,
  },
  brandTextCompact: { fontSize: 18 },
});
