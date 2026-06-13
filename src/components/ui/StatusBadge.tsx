import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useThemeStore } from '../../stores/themeStore';
import { AppText } from './AppText';
import { spacing, borderRadius } from '../../config/theme';

interface StatusBadgeProps {
  label: string;
  tone?: 'default' | 'success' | 'warning' | 'error';
}

export function StatusBadge({ label, tone = 'default' }: StatusBadgeProps) {
  const colors = useThemeStore((s) => s.colors);

  const tones = {
    default: { bg: colors.overlay, text: colors.textSecondary },
    success: { bg: colors.success + '22', text: colors.success },
    warning: { bg: colors.warning + '22', text: colors.warning },
    error: { bg: colors.error + '22', text: colors.error },
  };

  const t = tones[tone];

  return (
    <View style={[styles.badge, { backgroundColor: t.bg }]}>
      <AppText variant="small" style={[styles.text, { color: t.text }]}>
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.xs,
    marginTop: spacing.sm,
  },
  text: {
    fontSize: 10,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
});
