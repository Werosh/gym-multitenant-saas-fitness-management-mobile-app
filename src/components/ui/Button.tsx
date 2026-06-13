import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useThemeStore } from '../../stores/themeStore';
import { borderRadius, spacing } from '../../config/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
}: ButtonProps) {
  const colors = useThemeStore((s) => s.colors);

  const bgColors: Record<string, string> = {
    primary: colors.primary,
    secondary: colors.secondary,
    outline: 'transparent',
    danger: colors.error,
  };

  const textColors: Record<string, string> = {
    primary: '#FFFFFF',
    secondary: '#FFFFFF',
    outline: colors.primary,
    danger: '#FFFFFF',
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: bgColors[variant], borderColor: variant === 'outline' ? colors.primary : 'transparent' },
        variant === 'outline' && styles.outline,
        (disabled || loading) && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={textColors[variant]} />
      ) : (
        <Text style={[styles.text, { color: textColors[variant] }]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  outline: {
    borderWidth: 1.5,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
});
