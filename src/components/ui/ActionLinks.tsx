import React from 'react';
import { View, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { useThemeStore } from '../../stores/themeStore';
import { AppText } from './AppText';
import { spacing } from '../../config/theme';

interface ActionLinksProps {
  actions: { label: string; onPress: () => void; tone?: 'primary' | 'danger' }[];
  style?: ViewStyle;
}

export function ActionLinks({ actions, style }: ActionLinksProps) {
  const colors = useThemeStore((s) => s.colors);

  return (
    <View style={[styles.row, { borderTopColor: colors.borderSubtle }, style]}>
      {actions.map((action, index) => (
        <React.Fragment key={action.label}>
          {index > 0 && <View style={[styles.sep, { backgroundColor: colors.border }]} />}
          <TouchableOpacity style={styles.btn} onPress={action.onPress} hitSlop={6}>
            <AppText
              style={{
                fontSize: 13,
                fontWeight: '600',
                color: action.tone === 'danger' ? colors.error : colors.primary,
              }}
            >
              {action.label}
            </AppText>
          </TouchableOpacity>
        </React.Fragment>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: spacing.md,
  },
  sep: {
    width: 1,
    height: 14,
  },
  btn: {
    minHeight: 32,
    justifyContent: 'center',
  },
});
