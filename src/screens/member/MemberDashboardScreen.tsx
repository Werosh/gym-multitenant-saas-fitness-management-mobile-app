import React, { useCallback, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { ScreenContainer } from '../../components/ui/ScreenContainer';
import { Header } from '../../components/ui/Header';
import { StatCard } from '../../components/ui/StatCard';
import { Card } from '../../components/ui/Card';
import { AppText } from '../../components/ui/AppText';
import { Button } from '../../components/ui/Button';
import { RoleGuard } from '../../components/guards/RoleGuard';
import { useAuthStore } from '../../stores/authStore';
import { getMemberStats } from '../../stores/gymStore';
import { useThemeStore } from '../../stores/themeStore';
import { MemberDashboardStats } from '../../types';
import { spacing } from '../../config/theme';

export function MemberDashboardScreen() {
  const profile = useAuthStore((s) => s.profile);
  const logout = useAuthStore((s) => s.logout);
  const colors = useThemeStore((s) => s.colors);
  const [stats, setStats] = useState<MemberDashboardStats | null>(null);

  useFocusEffect(
    useCallback(() => {
      if (!profile?.gymId || !profile.userId) return;
      getMemberStats(profile.gymId, profile.userId).then(setStats);
    }, [profile?.gymId, profile?.userId])
  );

  return (
    <RoleGuard allowedRoles={['member']}>
      <ScreenContainer>
        <Header
          title="My Dashboard"
          subtitle={`Welcome, ${profile?.name ?? 'Member'}`}
          rightAction={{ label: 'Logout', onPress: logout }}
        />

        <View style={styles.statsGrid}>
          <StatCard label="Workouts" value={stats?.assignedWorkouts ?? '—'} />
          <StatCard label="Check-ins" value={stats?.totalCheckIns ?? '—'} accent={colors.secondary} />
        </View>

        <Card>
          <AppText variant="h3">Membership Status</AppText>
          <AppText
            variant="h2"
            style={{
              color:
                stats?.membershipStatus === 'active'
                  ? colors.success
                  : stats?.membershipStatus === 'expired'
                    ? colors.error
                    : colors.warning,
              marginTop: spacing.sm,
            }}
          >
            {(stats?.membershipStatus ?? 'none').toUpperCase()}
          </AppText>
          {profile?.expiryDate && (
            <AppText secondary style={{ marginTop: spacing.xs }}>
              Expires: {new Date(profile.expiryDate).toLocaleDateString()}
            </AppText>
          )}
        </Card>

        {profile?.goal && (
          <Card>
            <AppText variant="h3">Your Goal</AppText>
            <AppText secondary style={{ marginTop: spacing.sm }}>
              {profile.goal}
            </AppText>
          </Card>
        )}

        {profile?.weight && (
          <Card>
            <AppText variant="h3">Current Weight</AppText>
            <AppText variant="h2" style={{ marginTop: spacing.sm }}>
              {profile.weight} kg
            </AppText>
          </Card>
        )}
      </ScreenContainer>
    </RoleGuard>
  );
}

const styles = StyleSheet.create({
  statsGrid: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
});
