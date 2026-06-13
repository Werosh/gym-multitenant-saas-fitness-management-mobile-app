import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useResponsive } from '../../hooks/useResponsive';

interface StatGridProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function StatGrid({ children, style }: StatGridProps) {
  const { statColumns } = useResponsive();

  return (
    <View style={[styles.grid, style]}>
      {React.Children.map(children, (child) => (
        <View style={[styles.item, { width: `${100 / statColumns}%` }]}>{child}</View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
    marginBottom: 4,
  },
  item: {
    paddingHorizontal: 4,
    marginBottom: 8,
  },
});
