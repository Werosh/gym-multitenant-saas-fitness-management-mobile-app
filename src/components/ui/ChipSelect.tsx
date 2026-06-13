import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useThemeStore } from '../../stores/themeStore';
import { AppText } from './AppText';
import { borderRadius, spacing } from '../../config/theme';

interface ChipSelectProps<T extends string> {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}

export function ChipSelect<T extends string>({ options, value, onChange }: ChipSelectProps<T>) {
  const colors = useThemeStore((s) => s.colors);

  return (
    <View style={[styles.bar, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      {options.map((opt) => {
        const selected = value === opt.value;
        return (
          <TouchableOpacity
            key={opt.value}
            style={[
              styles.chip,
              selected && { backgroundColor: colors.elevated, borderColor: colors.primary },
            ]}
            onPress={() => onChange(opt.value)}
          >
            <AppText
              style={{
                fontSize: 13,
                fontWeight: '600',
                color: selected ? colors.primary : colors.textSecondary,
              }}
              numberOfLines={1}
            >
              {opt.label}
            </AppText>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    padding: 3,
    marginBottom: spacing.md,
    gap: 4,
  },
  chip: {
    flexGrow: 1,
    flexBasis: '30%',
    minWidth: 72,
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderRadius: borderRadius.xs,
    borderWidth: 1,
    borderColor: 'transparent',
  },
});
