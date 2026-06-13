import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useThemeStore } from '../../stores/themeStore';
import { borderRadius, spacing } from '../../config/theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function Card({ children, style }: CardProps) {
  const colors = useThemeStore((s) => s.colors);

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    marginBottom: spacing.md,
  },
});
