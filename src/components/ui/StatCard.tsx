import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useThemeStore } from '../../stores/themeStore';
import { AppText } from './AppText';
import { Card } from './Card';
import { borderRadius, spacing } from '../../config/theme';

interface StatCardProps {
  label: string;
  value: string | number;
  accent?: string;
}

export function StatCard({ label, value, accent }: StatCardProps) {
  const colors = useThemeStore((s) => s.colors);

  return (
    <Card style={styles.card}>
      <View style={[styles.accent, { backgroundColor: accent ?? colors.primary }]} />
      <AppText variant="caption" secondary>
        {label}
      </AppText>
      <AppText variant="h2" style={styles.value}>
        {value}
      </AppText>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: '45%',
    overflow: 'hidden',
  },
  accent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    borderTopLeftRadius: borderRadius.md,
    borderTopRightRadius: borderRadius.md,
  },
  value: {
    marginTop: spacing.xs,
  },
});
