import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useThemeStore } from '../../stores/themeStore';
import { spacing } from '../../config/theme';

export function Divider() {
  const colors = useThemeStore((s) => s.colors);
  return <View style={[styles.line, { backgroundColor: colors.borderSubtle }]} />;
}

const styles = StyleSheet.create({
  line: {
    height: StyleSheet.hairlineWidth,
    marginVertical: spacing.md,
  },
});
