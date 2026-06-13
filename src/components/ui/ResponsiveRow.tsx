import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useResponsive } from '../../hooks/useResponsive';
import { spacing } from '../../config/theme';

interface ResponsiveRowProps {
  children: React.ReactNode;
  style?: ViewStyle;
  gap?: number;
}

/** Side-by-side on wider screens, stacked on narrow phones. */
export function ResponsiveRow({ children, style, gap = spacing.sm }: ResponsiveRowProps) {
  const { stackActions } = useResponsive();

  return (
    <View
      style={[
        stackActions ? styles.stack : styles.row,
        !stackActions && { gap },
        style,
      ]}
    >
      {React.Children.map(children, (child) => (
        <View style={stackActions ? styles.stackChild : styles.rowChild}>{child}</View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  stack: {
    flexDirection: 'column',
    gap: spacing.sm,
  },
  rowChild: {
    flex: 1,
    minWidth: 0,
  },
  stackChild: {
    width: '100%',
  },
});
