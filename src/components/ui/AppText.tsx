import React from 'react';
import { Text as RNText, TextProps, StyleSheet } from 'react-native';
import { useThemeStore } from '../../stores/themeStore';
import { typography } from '../../config/theme';

interface AppTextProps extends TextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'caption' | 'small';
  secondary?: boolean;
}

export function AppText({ variant = 'body', secondary, style, ...props }: AppTextProps) {
  const colors = useThemeStore((s) => s.colors);

  return (
    <RNText
      style={[
        typography[variant],
        { color: secondary ? colors.textSecondary : colors.text },
        style,
      ]}
      {...props}
    />
  );
}
