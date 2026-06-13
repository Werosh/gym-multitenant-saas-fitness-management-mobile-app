import React from 'react';
import { Text, StyleSheet, TextStyle, StyleProp, View } from 'react-native';
import { useThemeStore } from '../../stores/themeStore';
import { brand, spacing } from '../../config/theme';

interface BrandTitleProps {
  size?: 'sm' | 'md' | 'lg';
  style?: StyleProp<TextStyle>;
}

export function BrandTitle({ size = 'md', style }: BrandTitleProps) {
  const colors = useThemeStore((s) => s.colors);
  const fontSize = size === 'lg' ? 28 : size === 'sm' ? 18 : 22;

  return (
    <Text style={[styles.base, { fontSize, color: colors.text }, style]}>
      My<Text style={{ color: brand.green }}>Gym</Text>Here
    </Text>
  );
}

export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <View style={compact ? styles.compactWrap : styles.wrap}>
      <BrandTitle size={compact ? 'sm' : 'md'} />
    </View>
  );
}

export function BrandTagline({ style }: { style?: StyleProp<TextStyle> }) {
  const colors = useThemeStore((s) => s.colors);
  return (
    <Text style={[styles.tagline, { color: colors.textSecondary }, style]}>
      Your Gym. Your Members. Your Growth.
    </Text>
  );
}

const styles = StyleSheet.create({
  base: {
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  wrap: {
    marginBottom: spacing.xl,
  },
  compactWrap: {
    marginBottom: spacing.md,
  },
  tagline: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    letterSpacing: 0.2,
  },
});
