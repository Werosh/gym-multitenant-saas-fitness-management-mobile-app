import React, { useCallback, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { ScreenContainer } from '../../components/ui/ScreenContainer';
import { Header } from '../../components/ui/Header';
import { StatCard } from '../../components/ui/StatCard';
import { AppText } from '../../components/ui/AppText';
import { Button } from '../../components/ui/Button';
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
    const data = await getOwnerStats(profile.gymId);
    setStats(data);
  }, [profile?.gymId, getOwnerStats]);

  useFocusEffect(
    useCallback(() => {
      loadStats();
    }, [loadStats])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadStats();
    setRefreshing(false);
  };

  return (
    <RoleGuard allowedRoles={['owner']}>
      <ScreenContainer onRefresh={onRefresh} refreshing={refreshing}>
        <Header
          title="Owner Dashboard"
          subtitle={`Welcome, ${profile?.name ?? 'Owner'}`}
          rightAction={{ label: 'Logout', onPress: logout }}
        />

        <View style={styles.statsGrid}>
          <StatCard label="Total Members" value={stats?.totalMembers ?? '—'} />
          <StatCard label="Active Members" value={stats?.activeMembers ?? '—'} accent={colors.success} />
          <StatCard label="Expired" value={stats?.expiredMemberships ?? '—'} accent={colors.warning} />
          <StatCard label="Today's Check-ins" value={stats?.todayAttendance ?? '—'} accent={colors.secondary} />
        </View>

        <Card>
          <AppText variant="h3">Revenue (Placeholder)</AppText>
          <AppText variant="h1" style={{ color: colors.primary, marginTop: spacing.sm }}>
            ${stats?.revenuePlaceholder?.toFixed(2) ?? '0.00'}
          </AppText>
          <AppText secondary style={{ marginTop: spacing.xs }}>
            Estimated monthly revenue based on active memberships
          </AppText>
        </Card>

        <Card>
          <AppText variant="h3">Attendance Summary</AppText>
          <AppText secondary style={{ marginTop: spacing.sm }}>
            {stats?.todayAttendance ?? 0} members checked in today
          </AppText>
        </Card>

        <Button title="Sign Out" variant="outline" onPress={logout} />
      </ScreenContainer>
    </RoleGuard>
  );
}

const styles = StyleSheet.create({
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
});
