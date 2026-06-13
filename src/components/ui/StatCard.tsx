import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useThemeStore } from '../../stores/themeStore';
import { AppText } from './AppText';
import { spacing } from '../../config/theme';

interface StatCardProps {
  label: string;
  value: string | number;
  accent?: string;
}

export function StatCard({ label, value, accent }: StatCardProps) {
  const colors = useThemeStore((s) => s.colors);
  const barColor = accent ?? colors.primary;

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={[styles.accent, { backgroundColor: barColor }]} />
      <AppText variant="label" secondary style={styles.label}>
        {label}
      </AppText>
      <AppText variant="stat" style={styles.value}>
        {value}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    padding: spacing.md,
    paddingLeft: spacing.md + 4,
    borderRadius: 6,
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: spacing.sm,
    overflow: 'hidden',
  },
  accent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
  },
  label: {
    marginBottom: spacing.xs,
  },
  value: {
    fontVariant: ['tabular-nums'],
  },
});
