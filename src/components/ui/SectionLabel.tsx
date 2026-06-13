import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useThemeStore } from '../../stores/themeStore';
import { AppText } from './AppText';
import { spacing } from '../../config/theme';

interface SectionLabelProps {
  title: string;
  style?: ViewStyle;
}

export function SectionLabel({ title, style }: SectionLabelProps) {
  return (
    <View style={[styles.wrap, style]}>
      <AppText variant="label" secondary>
        {title}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: spacing.sm,
    marginTop: spacing.xs,
  },
});
