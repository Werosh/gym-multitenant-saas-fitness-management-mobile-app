import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
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
        <AppText variant="h2" numberOfLines={2} style={styles.title}>
          {title}
        </AppText>
        {subtitle && (
          <AppText variant="caption" secondary numberOfLines={2} style={styles.subtitle}>
            {subtitle}
          </AppText>
        )}
      </View>
      {rightAction && (
        <TouchableOpacity onPress={rightAction.onPress} hitSlop={8} style={styles.action}>
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
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: spacing.sm,
  },
  left: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    flexShrink: 1,
  },
  subtitle: {
    marginTop: 4,
  },
  action: {
    flexShrink: 0,
    paddingVertical: 4,
  },
});
