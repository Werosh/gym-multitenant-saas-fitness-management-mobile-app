import React, { useCallback, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { ScreenContainer } from '../../components/ui/ScreenContainer';
import { Header } from '../../components/ui/Header';
import { StatCard } from '../../components/ui/StatCard';
import { StatGrid } from '../../components/ui/StatGrid';
import { SectionLabel } from '../../components/ui/SectionLabel';
import { Card } from '../../components/ui/Card';
import { AppText } from '../../components/ui/AppText';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { RoleGuard } from '../../components/guards/RoleGuard';
import { useAuthStore } from '../../stores/authStore';
import { getMemberStats } from '../../stores/gymStore';
import { MemberDashboardStats } from '../../types';
import { spacing } from '../../config/theme';

export function MemberDashboardScreen() {
  const profile = useAuthStore((s) => s.profile);
  const logout = useAuthStore((s) => s.logout);
  const [stats, setStats] = useState<MemberDashboardStats | null>(null);

  useFocusEffect(
    useCallback(() => {
      if (!profile?.gymId || !profile.userId) return;
      getMemberStats(profile.gymId, profile.userId).then(setStats);
    }, [profile?.gymId, profile?.userId])
  );

  const membershipTone =
    stats?.membershipStatus === 'active' ? 'success' : stats?.membershipStatus === 'expired' ? 'warning' : 'default';

  return (
    <RoleGuard allowedRoles={['member']}>
      <ScreenContainer>
        <Header title="Home" subtitle={profile?.name ?? 'Member'} rightAction={{ label: 'Sign out', onPress: logout }} />

        <SectionLabel title="This week" />
        <StatGrid>
          <StatCard label="Workouts" value={stats?.assignedWorkouts ?? '—'} />
          <StatCard label="Check-ins" value={stats?.totalCheckIns ?? '—'} />
        </StatGrid>

        <SectionLabel title="Membership" />
        <Card>
          <StatusBadge label={stats?.membershipStatus ?? 'none'} tone={membershipTone} />
          {profile?.expiryDate && (
            <AppText variant="caption" secondary style={{ marginTop: spacing.sm }}>
              Renews {new Date(profile.expiryDate).toLocaleDateString()}
            </AppText>
          )}
        </Card>

        {(profile?.goal || profile?.weight) && (
          <>
            <SectionLabel title="Profile" />
            {profile?.goal && (
              <Card>
                <AppText variant="caption" secondary>Goal</AppText>
                <AppText variant="h3" style={{ marginTop: 4 }} numberOfLines={3}>{profile.goal}</AppText>
              </Card>
            )}
            {profile?.weight != null && (
              <Card>
                <AppText variant="caption" secondary>Weight</AppText>
                <AppText variant="stat" style={{ marginTop: 4 }}>{profile.weight} kg</AppText>
              </Card>
            )}
          </>
        )}
      </ScreenContainer>
    </RoleGuard>
  );
}
