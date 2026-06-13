import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useThemeStore } from '../../stores/themeStore';
import { borderRadius, spacing } from '../../config/theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padded?: boolean;
}

export function Card({ children, style, padded = true }: CardProps) {
  const colors = useThemeStore((s) => s.colors);

  return (
    <View
      style={[
        styles.card,
        padded && styles.padded,
        { backgroundColor: colors.card, borderColor: colors.border },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.sm,
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: spacing.md,
  },
  padded: {
    padding: spacing.md,
  },
});
