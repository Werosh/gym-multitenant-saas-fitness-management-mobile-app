import React from 'react';
import { View, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeStore } from '../../stores/themeStore';
import { AppText } from './AppText';
import { spacing, borderRadius } from '../../config/theme';

interface ListRowProps {
  title: string;
  subtitle?: string;
  meta?: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
  showChevron?: boolean;
  style?: ViewStyle;
}

export function ListRow({
  title,
  subtitle,
  meta,
  onPress,
  rightElement,
  showChevron = !!onPress,
  style,
}: ListRowProps) {
  const colors = useThemeStore((s) => s.colors);
  const Wrapper = onPress ? TouchableOpacity : View;

  return (
    <Wrapper
      style={[styles.row, { borderBottomColor: colors.borderSubtle }, style]}
      onPress={onPress}
      activeOpacity={0.65}
    >
      <View style={styles.content}>
        <AppText variant="h3" style={styles.title}>
          {title}
        </AppText>
        {subtitle && (
          <AppText variant="caption" secondary numberOfLines={2}>
            {subtitle}
          </AppText>
        )}
        {meta && (
          <AppText variant="small" secondary style={styles.meta}>
            {meta}
          </AppText>
        )}
      </View>
      {rightElement}
      {showChevron && onPress && (
        <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
      )}
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: spacing.sm,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    marginBottom: 2,
  },
  meta: {
    marginTop: spacing.xs,
  },
});
