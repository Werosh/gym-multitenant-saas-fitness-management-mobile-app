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
import { getAllGyms } from '../../services/gymService';
import { Gym } from '../../types';
import { spacing } from '../../config/theme';

export function AdminDashboardScreen() {
  const profile = useAuthStore((s) => s.profile);
  const logout = useAuthStore((s) => s.logout);
  const [gyms, setGyms] = useState<Gym[]>([]);

  useFocusEffect(
    useCallback(() => {
      getAllGyms().then(setGyms);
    }, [])
  );

  return (
    <RoleGuard allowedRoles={['super_admin']}>
      <ScreenContainer>
        <Header
          title="Super Admin"
          subtitle={`Welcome, ${profile?.name ?? 'Admin'}`}
          rightAction={{ label: 'Logout', onPress: logout }}
        />

        <View style={styles.statsGrid}>
          <StatCard label="Total Gyms" value={gyms.length} />
          <StatCard label="Platform Status" value="Active" />
        </View>

        <Card>
          <AppText variant="h3">Registered Gyms</AppText>
          {gyms.length === 0 ? (
            <AppText secondary style={{ marginTop: spacing.sm }}>
              No gyms registered yet.
            </AppText>
          ) : (
            gyms.map((gym) => (
              <View key={gym.gymId} style={styles.gymRow}>
                <AppText variant="h3">{gym.gymName}</AppText>
                <AppText secondary>{gym.location}</AppText>
                <AppText variant="caption" secondary>
                  Plan: {gym.subscriptionPlan} · Code: {gym.gymCode}
                </AppText>
              </View>
            ))
          )}
        </Card>

        <Card>
          <AppText variant="h3">Analytics (Placeholder)</AppText>
          <AppText secondary style={{ marginTop: spacing.sm }}>
            Platform-wide analytics and revenue reports will be available here.
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
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  gymRow: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#334155',
  },
});
