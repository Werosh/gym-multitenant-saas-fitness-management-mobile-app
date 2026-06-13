import React from 'react';
import { View, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from './AppText';
import { useGoogleSignIn } from '../../hooks/useGoogleSignIn';
import { useThemeStore } from '../../stores/themeStore';
import { borderRadius, spacing, brand } from '../../config/theme';

interface GoogleSignInButtonProps {
  label?: string;
}

export function GoogleSignInButton({ label = 'Continue with Google' }: GoogleSignInButtonProps) {
  const colors = useThemeStore((s) => s.colors);
  const { signInWithGoogle, isGoogleConfigured, disabled, isLoading } = useGoogleSignIn();

  const handlePress = async () => {
    if (!isGoogleConfigured) {
      Alert.alert(
        'Google sign-in not configured',
        'Add EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID to your .env file (Firebase Console → Authentication → Google → Web client ID).',
      );
      return;
    }

    try {
      await signInWithGoogle();
    } catch (err) {
      Alert.alert('Google sign in failed', err instanceof Error ? err.message : 'Try again.');
    }
  };

  return (
    <TouchableOpacity
      style={[styles.button, { borderColor: colors.border, backgroundColor: colors.surface }]}
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.75}
    >
      <View style={styles.content}>
        <Ionicons name="logo-google" size={18} color={brand.white} />
        <AppText style={styles.label}>{isLoading ? 'Signing in...' : label}</AppText>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 48,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
  },
});
