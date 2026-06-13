import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useThemeStore } from '../../stores/themeStore';
import { AppText } from './AppText';
import { spacing } from '../../config/theme';

interface HeaderProps {
  title: string;
  subtitle?: string;
  rightAction?: { label: string; onPress: () => void };
}

export function Header({ title, subtitle, rightAction }: HeaderProps) {
  const colors = useThemeStore((s) => s.colors);

  return (
    <View style={[styles.container, { borderBottomColor: colors.borderSubtle }]}>
      <View style={styles.left}>
        <AppText variant="h2">{title}</AppText>
        {subtitle && (
          <AppText variant="caption" secondary style={styles.subtitle}>
            {subtitle}
          </AppText>
        )}
      </View>
      {rightAction && (
        <TouchableOpacity onPress={rightAction.onPress} hitSlop={8}>
          <AppText variant="caption" style={{ color: colors.primary, fontWeight: '600' }}>
            {rightAction.label}
          </AppText>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  left: {
    flex: 1,
    paddingRight: spacing.md,
  },
  subtitle: {
    marginTop: 4,
  },
});
