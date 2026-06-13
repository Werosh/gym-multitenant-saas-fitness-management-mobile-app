import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
} from 'react-native';
import { useThemeStore } from '../../stores/themeStore';
import { borderRadius, spacing, brand } from '../../config/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'md' | 'sm';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  style,
}: ButtonProps) {
  const colors = useThemeStore((s) => s.colors);

  const variants = {
    primary: {
      bg: colors.primary,
      text: colors.onPrimary ?? brand.black,
      border: colors.primary,
    },
    secondary: {
      bg: colors.elevated,
      text: colors.text,
      border: colors.border,
    },
    outline: {
      bg: 'transparent',
      text: colors.text,
      border: colors.border,
    },
    ghost: {
      bg: 'transparent',
      text: colors.primary,
      border: 'transparent',
    },
    danger: {
      bg: colors.error,
      text: '#FFFFFF',
      border: colors.error,
    },
  };

  const v = variants[variant];
  const isSm = size === 'sm';

  return (
    <TouchableOpacity
      style={[
        styles.button,
        isSm && styles.buttonSm,
        {
          backgroundColor: v.bg,
          borderColor: v.border,
        },
        variant !== 'ghost' && styles.bordered,
        (disabled || loading) && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.75}
    >
      {loading ? (
        <ActivityIndicator color={v.text} size="small" />
      ) : (
        <Text style={[styles.text, isSm && styles.textSm, { color: v.text }]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  buttonSm: {
    minHeight: 40,
    paddingVertical: 10,
    paddingHorizontal: spacing.md,
  },
  bordered: {
    borderWidth: 1,
  },
  disabled: {
    opacity: 0.45,
  },
  text: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  textSm: {
    fontSize: 14,
  },
});
