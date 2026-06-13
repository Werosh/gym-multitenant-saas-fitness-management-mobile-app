import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useThemeStore } from '../../stores/themeStore';
import { useAuthStore } from '../../stores/authStore';
import { UserRole } from '../../types';
import { AppText } from '../ui/AppText';
import { spacing } from '../../config/theme';

interface RoleGuardProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function RoleGuard({ allowedRoles, children, fallback }: RoleGuardProps) {
  const profile = useAuthStore((s) => s.profile);
  const colors = useThemeStore((s) => s.colors);

  if (!profile || !allowedRoles.includes(profile.role)) {
    return (
      fallback ?? (
        <View style={[styles.denied, { backgroundColor: colors.background }]}>
          <AppText variant="h3">Access Denied</AppText>
          <AppText secondary style={styles.message}>
            You do not have permission to view this screen.
          </AppText>
        </View>
      )
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  denied: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  message: {
    marginTop: spacing.sm,
    textAlign: 'center',
  },
});
