import React, { useCallback, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { ScreenContainer } from '../../components/ui/ScreenContainer';
import { Header } from '../../components/ui/Header';
import { StatCard } from '../../components/ui/StatCard';
import { SectionLabel } from '../../components/ui/SectionLabel';
import { AppText } from '../../components/ui/AppText';
import { Card } from '../../components/ui/Card';
import { RoleGuard } from '../../components/guards/RoleGuard';
import { useAuthStore } from '../../stores/authStore';
import { useGymStore } from '../../stores/gymStore';
import { useThemeStore } from '../../stores/themeStore';
import { OwnerDashboardStats } from '../../types';
import { spacing } from '../../config/theme';

export function OwnerDashboardScreen() {
  const profile = useAuthStore((s) => s.profile);
  const logout = useAuthStore((s) => s.logout);
  const getOwnerStats = useGymStore((s) => s.getOwnerStats);
  const colors = useThemeStore((s) => s.colors);
  const [stats, setStats] = useState<OwnerDashboardStats | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadStats = useCallback(async () => {
    if (!profile?.gymId) return;
    setStats(await getOwnerStats(profile.gymId));
  }, [profile?.gymId, getOwnerStats]);

  useFocusEffect(useCallback(() => { loadStats(); }, [loadStats]));

  const onRefresh = async () => {
    setRefreshing(true);
    await loadStats();
    setRefreshing(false);
  };

  return (
    <RoleGuard allowedRoles={['owner']}>
      <ScreenContainer onRefresh={onRefresh} refreshing={refreshing}>
        <Header
          title="Dashboard"
          subtitle={profile?.name ?? 'Owner'}
          rightAction={{ label: 'Sign out', onPress: logout }}
        />

        <SectionLabel title="Overview" />
        <View style={styles.statsGrid}>
          <StatCard label="Members" value={stats?.totalMembers ?? '—'} />
          <StatCard label="Active" value={stats?.activeMembers ?? '—'} accent={colors.success} />
          <StatCard label="Expired" value={stats?.expiredMemberships ?? '—'} accent={colors.warning} />
          <StatCard label="Check-ins today" value={stats?.todayAttendance ?? '—'} />
        </View>

        <SectionLabel title="Revenue" />
        <Card>
          <AppText variant="caption" secondary>Estimated monthly</AppText>
          <AppText variant="stat" style={{ marginTop: spacing.xs }}>
            ${stats?.revenuePlaceholder?.toFixed(0) ?? '0'}
          </AppText>
          <AppText variant="small" muted style={{ marginTop: spacing.xs }}>
            Based on active memberships
          </AppText>
        </Card>

        <SectionLabel title="Attendance" />
        <Card>
          <AppText variant="h3">{stats?.todayAttendance ?? 0} check-ins</AppText>
          <AppText variant="caption" secondary style={{ marginTop: 4 }}>
            Recorded today at your gym
          </AppText>
        </Card>
      </ScreenContainer>
    </RoleGuard>
  );
}

const styles = StyleSheet.create({
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
});
