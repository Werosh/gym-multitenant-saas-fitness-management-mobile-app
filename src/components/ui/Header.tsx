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
    <View style={styles.container}>
      <View style={styles.left}>
        <AppText variant="h2">{title}</AppText>
        {subtitle && (
          <AppText variant="caption" secondary style={styles.subtitle}>
            {subtitle}
          </AppText>
        )}
      </View>
      {rightAction && (
        <TouchableOpacity onPress={rightAction.onPress}>
          <AppText style={{ color: colors.primary, fontWeight: '600' }}>
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
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  left: {
    flex: 1,
  },
  subtitle: {
    marginTop: spacing.xs,
  },
});
